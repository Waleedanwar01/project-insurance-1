from django.urls import path
from .views import (
    StaticPageDetailView, TeamMemberListView, CompanyInfoView,
    ContactSubmissionCreateView, get_all_static_pages,
    CarInsuranceQuotesPageView, get_navbar_pages, get_footer_pages
)

urlpatterns = [
    # Static pages
    path('api/pages/', get_all_static_pages, name='all-static-pages'),
    # Place specific endpoints BEFORE the dynamic page_type route to avoid shadowing
    path('api/pages/nav/', get_navbar_pages, name='navbar-pages'),
    path('api/pages/footer/', get_footer_pages, name='footer-pages'),
    path('api/pages/<str:page_type>/', StaticPageDetailView.as_view(), name='static-page-detail'),
    
    # Team members
    path('api/team/', TeamMemberListView.as_view(), name='team-members'),
    
    # Company info
    path('api/company/', CompanyInfoView.as_view(), name='company-info'),
    
    # Contact form
    path('api/contact/', ContactSubmissionCreateView.as_view(), name='contact-submission'),

    # Car Insurance Quotes page structured content
    path('api/car-insurance-quotes/', CarInsuranceQuotesPageView.as_view(), name='car-insurance-quotes'),
]