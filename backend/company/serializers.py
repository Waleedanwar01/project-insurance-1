from rest_framework import serializers
from .models import InsuranceCompany, CompanyReview


class InsuranceCompanySerializer(serializers.ModelSerializer):
    reviews = serializers.SerializerMethodField()

    class Meta:
        model = InsuranceCompany
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "website",
            "phone",
            "address",
            "logo",
            "is_high_risk_recommended",
            "high_risk_blurb",
            "is_active",
            "order",
            "reviews",
        ]

    def get_reviews(self, obj):
        qs = obj.reviews.filter(is_published=True).order_by("-published_at")
        return CompanyReviewSerializer(qs, many=True, context=self.context).data


class CompanyReviewSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source="company.name", read_only=True)

    class Meta:
        model = CompanyReview
        fields = [
            "id",
            "company",
            "company_name",
            "title",
            "slug",
            "summary",
            "content",
            "rating",
            "author_name",
            "is_published",
            "published_at",
        ]