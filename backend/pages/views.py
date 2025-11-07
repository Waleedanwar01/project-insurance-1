from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.utils import timezone
from .models import StaticPage, TeamMember, ContactSubmission, CompanyInfo, CarInsuranceQuotesPage
from .serializers import (
    StaticPageSerializer, TeamMemberSerializer, 
    ContactSubmissionSerializer, CompanyInfoSerializer, CarInsuranceQuotesPageSerializer
)


@api_view(['GET'])
def get_all_static_pages(request):
    """Get all static pages"""
    pages = StaticPage.objects.filter(is_active=True)
    serializer = StaticPageSerializer(pages, many=True)
    return Response(serializer.data)


def _page_url(page_type: str) -> str:
    mapping = {
        'about': '/about',
        'contact': '/contact',
        'privacy': '/privacy',
        'terms': '/terms',
        'california_privacy': '/privacy-california',
        'disclosure': '/disclosure',
        'team': '/team',
        'how_to_use': '/how-to-use',
        'high_risk_auto_insurance': '/high-risk-auto-insurance',
    }
    # For admin-typed pages without predefined routes, use generic /pages/<page_type>
    return mapping.get(page_type, f'/pages/{page_type}')


@api_view(['GET'])
def get_navbar_pages(request):
    """List active static pages configured to show in navbar"""
    pages = StaticPage.objects.filter(is_active=True, show_in_navbar=True).order_by('nav_order', 'title')
    data = [{
        'title': p.title,
        'label': p.menu_label or p.title,
        'group': p.nav_group or 'Company',
        'page_type': p.page_type,
        'url': _page_url(p.page_type)
    } for p in pages]
    return Response(data)


@api_view(['GET'])
def get_footer_pages(request):
    """List active static pages configured to show in footer"""
    pages = StaticPage.objects.filter(is_active=True, show_in_footer=True).order_by('footer_order', 'title')
    data = [{'title': p.title, 'label': p.menu_label or p.title, 'page_type': p.page_type, 'url': _page_url(p.page_type)} for p in pages]
    return Response(data)


class StaticPageDetailView(generics.RetrieveAPIView):
    """Get static page by page type"""
    serializer_class = StaticPageSerializer
    lookup_field = 'page_type'
    
    def get_queryset(self):
        return StaticPage.objects.filter(is_active=True)


class TeamMemberListView(generics.ListAPIView):
    """Get all active team members"""
    serializer_class = TeamMemberSerializer
    
    def get_queryset(self):
        return TeamMember.objects.filter(is_active=True)


class CompanyInfoView(generics.RetrieveAPIView):
    """Get active company information"""
    serializer_class = CompanyInfoSerializer
    
    def get_object(self):
        # Return the active company info, or the first one if none is active
        active_company = CompanyInfo.objects.filter(is_active=True).first()
        if active_company:
            return active_company
        # Fallback to first company info if none is marked as active
        return CompanyInfo.objects.first()


class ContactSubmissionCreateView(generics.CreateAPIView):
    """Create contact form submission and send emails"""
    queryset = ContactSubmission.objects.all()
    serializer_class = ContactSubmissionSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Save the contact submission
        contact_submission = serializer.save()
        
        # Send emails
        try:
            # Email context
            context = {
                'name': contact_submission.name,
                'email': contact_submission.email,
                'phone': contact_submission.phone,
                'subject': contact_submission.subject,
                'message': contact_submission.message,
                'submitted_at': contact_submission.created_at.strftime('%B %d, %Y at %I:%M %p'),
                'site_name': settings.SITE_NAME,
                'site_url': settings.SITE_URL,
            }
            
            # Send email to admin
            admin_html_message = render_to_string('pages/contact_admin_email.html', context)
            admin_plain_message = strip_tags(admin_html_message)
            
            send_mail(
                subject=f'New Contact Form Submission - {contact_submission.subject or "General Inquiry"}',
                message=admin_plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[settings.ADMIN_EMAIL],
                html_message=admin_html_message,
                fail_silently=False,
            )
            
            # Send confirmation email to user
            user_html_message = render_to_string('pages/contact_user_email.html', context)
            user_plain_message = strip_tags(user_html_message)
            
            send_mail(
                subject=f'Thank you for contacting {settings.SITE_NAME}',
                message=user_plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[contact_submission.email],
                html_message=user_html_message,
                fail_silently=False,
            )
            
            return Response({
                'message': 'Contact form submitted successfully! We will get back to you soon.',
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            # If email fails, still return success but log the error
            return Response({
                'message': 'Contact form submitted successfully! However, there was an issue sending confirmation emails.',
                'data': serializer.data,
                'email_error': str(e)
            }, status=status.HTTP_201_CREATED)


class CarInsuranceQuotesPageView(generics.RetrieveAPIView):
    """Get Car Insurance Quotes page structured content"""
    serializer_class = CarInsuranceQuotesPageSerializer

    def get_object(self):
        obj = CarInsuranceQuotesPage.objects.first()
        if obj:
            return obj
        # Ensure at least one record exists to avoid 404/500
        return CarInsuranceQuotesPage.objects.create(
            title='Car Insurance Quotes',
            intro_paragraphs=[
                'Compare personalized car insurance quotes and learn how rates are calculated.',
            ],
            takeaways=[
                'Quotes vary by vehicle, location, driving history, and coverage.',
            ],
            faqs=[
                { 'id': 'safe-online', 'question': 'Is getting a car insurance quote online safe?', 'answer': 'Yes, most providers use secure forms and encryption.' },
            ],
            toc_items=[
                { 'label': 'How Quotes Are Calculated', 'anchor': '#quote-calculation' },
                { 'label': 'Frequently Asked Questions', 'anchor': '#faq' },
            ],
        )