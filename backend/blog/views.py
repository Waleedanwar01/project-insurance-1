from rest_framework import viewsets, filters, status
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
from .models import BlogPost, Category, BlogFeedback
from .serializers import BlogPostListSerializer, BlogPostDetailSerializer, CategorySerializer, BlogFeedbackSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import generics
from django.db.models import F

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'

    def get_queryset(self):
        queryset = Category.objects.all()
        # Filter by type (e.g., main/sub)
        category_type = self.request.query_params.get('type')
        if category_type:
            queryset = queryset.filter(type=category_type)

        # Filter by parent slug
        parent_slug = self.request.query_params.get('parent')
        if parent_slug:
            queryset = queryset.filter(parent__slug=parent_slug)

        # Filter by parent name
        parent_name = self.request.query_params.get('parent__name')
        if parent_name:
            queryset = queryset.filter(parent__name=parent_name)

        return queryset

class BlogPostViewSet(viewsets.ModelViewSet):
    queryset = (
        BlogPost.objects.all()
        .select_related('category', 'author')
        .prefetch_related('additional_images')
        .order_by('-published_at')
    )
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'summary', 'content']
    ordering_fields = ['published_at', 'views']
    lookup_field = 'slug'  # ✅ This enables /api/blog/posts/<slug>/

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        response['Cache-Control'] = 'public, max-age=300, stale-while-revalidate=600'
        return response

    def retrieve(self, request, *args, **kwargs):
        response = super().retrieve(request, *args, **kwargs)
        response['Cache-Control'] = 'public, max-age=300, stale-while-revalidate=600'
        return response
    
    def get_queryset(self):
        queryset = BlogPost.objects.filter(is_published=True).order_by('-published_at')
        
        # Filter by category name
        category_name = self.request.query_params.get('category__name')
        if category_name:
            queryset = queryset.filter(category__name=category_name)
            
        # Filter by category slug (for backward compatibility)
        category_slug = self.request.query_params.get('category')
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)

        # Filter by parent category slug
        parent_slug = self.request.query_params.get('category__parent')
        if parent_slug:
            queryset = queryset.filter(category__parent__slug=parent_slug)

        # Filter by parent category name
        parent_name = self.request.query_params.get('category__parent__name')
        if parent_name:
            queryset = queryset.filter(category__parent__name=parent_name)
            
        return queryset

    def get_serializer_class(self):
        if self.action in ['list']:
            return BlogPostListSerializer
        return BlogPostDetailSerializer

    # Example custom action to increment views
    @action(detail=True, methods=['post'])
    def increment_view(self, request, slug=None):  # slug instead of pk
        post = self.get_object()
        post.views = post.views + 1
        post.save()
        return Response({'views': post.views})

    @action(detail=True, methods=['post'])
    def feedback(self, request, slug=None):
        """Submit feedback for a blog post"""
        blog_post = self.get_object()
        serializer = BlogFeedbackSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            try:
                feedback = serializer.save(blog_post=blog_post)
                
                # Update blog post helpful counts
                if feedback.is_helpful:
                    BlogPost.objects.filter(pk=blog_post.pk).update(helpful_count=F('helpful_count') + 1)
                else:
                    BlogPost.objects.filter(pk=blog_post.pk).update(not_helpful_count=F('not_helpful_count') + 1)
                
                return Response(
                    {'message': 'Feedback submitted successfully'}, 
                    status=status.HTTP_201_CREATED
                )
            except Exception as e:
                return Response(
                    {'error': 'You have already provided feedback for this blog post'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BlogPostsByCategory(generics.ListAPIView):
    serializer_class = BlogPostListSerializer

    def get_queryset(self):
        category_slug = self.request.query_params.get('category')
        if category_slug:
            return BlogPost.objects.filter(category__slug=category_slug, is_published=True)
        return BlogPost.objects.filter(is_published=True)

