from rest_framework import generics, filters
from rest_framework.permissions import AllowAny

from .models import InsuranceCompany, CompanyReview
from .serializers import InsuranceCompanySerializer, CompanyReviewSerializer


class InsuranceCompanyListView(generics.ListAPIView):
    serializer_class = InsuranceCompanySerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "description"]
    ordering_fields = ["order", "name"]

    def get_queryset(self):
        qs = InsuranceCompany.objects.filter(is_active=True)
        # Optional filter: high-risk recommendations
        recommended = self.request.query_params.get("high_risk_recommended")
        if recommended in ["1", "true", "True"]:
            qs = qs.filter(is_high_risk_recommended=True)
        return qs.order_by("order", "name")


class InsuranceCompanyDetailView(generics.RetrieveAPIView):
    serializer_class = InsuranceCompanySerializer
    permission_classes = [AllowAny]
    lookup_field = "slug"

    def get_queryset(self):
        return InsuranceCompany.objects.filter(is_active=True)


class CompanyReviewByCompanyListView(generics.ListAPIView):
    serializer_class = CompanyReviewSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        company_slug = self.kwargs.get("slug")
        return CompanyReview.objects.filter(is_published=True, company__slug=company_slug).order_by("-published_at")


class CompanyReviewDetailView(generics.RetrieveAPIView):
    serializer_class = CompanyReviewSerializer
    permission_classes = [AllowAny]
    lookup_field = "slug"

    def get_queryset(self):
        return CompanyReview.objects.filter(is_published=True)
