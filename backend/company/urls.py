from django.urls import path
from .views import (
    InsuranceCompanyListView,
    InsuranceCompanyDetailView,
    CompanyReviewByCompanyListView,
    CompanyReviewDetailView,
)

urlpatterns = [
    path('insurers/', InsuranceCompanyListView.as_view(), name='insurance-company-list'),
    path('insurers/<slug:slug>/', InsuranceCompanyDetailView.as_view(), name='insurance-company-detail'),
    path('insurers/<slug:slug>/reviews/', CompanyReviewByCompanyListView.as_view(), name='company-review-by-company'),
    path('reviews/<slug:slug>/', CompanyReviewDetailView.as_view(), name='company-review-detail'),
]