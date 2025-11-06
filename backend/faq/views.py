from rest_framework import viewsets, filters, status, generics
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, F
from .models import FAQ, FAQCategory, FAQFeedback
from .serializers import (
    FAQListSerializer, 
    FAQDetailSerializer, 
    FAQCategorySerializer,
    FAQFeedbackSerializer
)


class FAQCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = FAQCategory.objects.filter(is_active=True)
    serializer_class = FAQCategorySerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'

    @action(detail=True, methods=['get'])
    def faqs(self, request, slug=None):
        """Get all FAQs for a specific category"""
        category = self.get_object()
        faqs = FAQ.objects.filter(
            category=category, 
            is_published=True
        ).order_by('order', '-created_at')
        
        serializer = FAQListSerializer(faqs, many=True, context={'request': request})
        return Response(serializer.data)


class FAQViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = FAQ.objects.filter(is_published=True).select_related('category')
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category__slug', 'priority', 'is_featured']
    search_fields = ['question', 'answer', 'short_answer', 'tags']
    ordering_fields = ['created_at', 'views', 'helpful_count']
    ordering = ['category__order', 'order', '-created_at']
    lookup_field = 'slug'

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        response['Cache-Control'] = 'public, max-age=300, stale-while-revalidate=600'
        return response

    def retrieve(self, request, *args, **kwargs):
        response = super().retrieve(request, *args, **kwargs)
        response['Cache-Control'] = 'public, max-age=300, stale-while-revalidate=600'
        return response

    def get_serializer_class(self):
        if self.action == 'list':
            return FAQListSerializer
        return FAQDetailSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by category if provided
        category_slug = self.request.query_params.get('category')
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        
        # Filter featured FAQs
        featured = self.request.query_params.get('featured')
        if featured and featured.lower() == 'true':
            queryset = queryset.filter(is_featured=True)
        
        # Filter by priority
        priority = self.request.query_params.get('priority')
        if priority:
            queryset = queryset.filter(priority=priority)
        
        return queryset.select_related('category')

    def retrieve(self, request, *args, **kwargs):
        """Override retrieve to increment view count"""
        instance = self.get_object()
        # Increment view count
        FAQ.objects.filter(pk=instance.pk).update(views=F('views') + 1)
        # Refresh instance to get updated view count
        instance.refresh_from_db()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured FAQs"""
        faqs = self.get_queryset().filter(is_featured=True)[:10]
        serializer = FAQListSerializer(faqs, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def recent(self, request):
        """Get recent FAQs"""
        limit = int(request.query_params.get('limit', 5))
        faqs = self.get_queryset().order_by('-created_at')[:limit]
        serializer = FAQListSerializer(faqs, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def popular(self, request):
        """Get popular FAQs based on views"""
        limit = int(request.query_params.get('limit', 10))
        faqs = self.get_queryset().order_by('-views', '-helpful_count')[:limit]
        serializer = FAQListSerializer(faqs, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def feedback(self, request, slug=None):
        """Submit feedback for an FAQ"""
        faq = self.get_object()
        serializer = FAQFeedbackSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            try:
                feedback = serializer.save(faq=faq)
                
                # Update FAQ helpful counts
                if feedback.is_helpful:
                    FAQ.objects.filter(pk=faq.pk).update(helpful_count=F('helpful_count') + 1)
                else:
                    FAQ.objects.filter(pk=faq.pk).update(not_helpful_count=F('not_helpful_count') + 1)
                
                return Response(
                    {'message': 'Feedback submitted successfully'}, 
                    status=status.HTTP_201_CREATED
                )
            except Exception as e:
                return Response(
                    {'error': 'You have already provided feedback for this FAQ'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FAQSearchView(generics.ListAPIView):
    serializer_class = FAQListSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        query = self.request.query_params.get('q', '')
        if query:
            return FAQ.objects.filter(
                Q(question__icontains=query) |
                Q(answer__icontains=query) |
                Q(short_answer__icontains=query) |
                Q(tags__icontains=query),
                is_published=True
            ).select_related('category').order_by('-views', '-created_at')
        return FAQ.objects.none()


class RecentContentView(generics.ListAPIView):
    """Combined view for recent blogs and FAQs for footer"""
    permission_classes = [AllowAny]

    def list(self, request, *args, **kwargs):
        from blog.models import BlogPost
        from blog.serializers import BlogPostListSerializer
        
        # Get recent blogs
        recent_blogs = BlogPost.objects.filter(is_published=True).order_by('-published_at')[:3]
        blog_serializer = BlogPostListSerializer(recent_blogs, many=True, context={'request': request})
        
        # Get recent FAQs
        recent_faqs = FAQ.objects.filter(is_published=True).order_by('-created_at')[:3]
        faq_serializer = FAQListSerializer(recent_faqs, many=True, context={'request': request})
        
        resp = Response({
            'recent_blogs': blog_serializer.data,
            'recent_faqs': faq_serializer.data
        })
        resp['Cache-Control'] = 'public, max-age=300, stale-while-revalidate=600'
        return resp
