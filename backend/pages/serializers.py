from rest_framework import serializers
from .models import StaticPage, TeamMember, ContactSubmission, CompanyInfo, CarInsuranceQuotesPage


class StaticPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = StaticPage
        fields = [
            'id', 'page_type', 'title', 'menu_label', 'nav_group', 'meta_title', 'meta_description', 'meta_keywords', 'content',
            'show_in_navbar', 'nav_order', 'show_in_footer', 'footer_order',
            'updated_at'
        ]


class TeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = [
            'id', 'name', 'position', 'bio', 'image', 'email', 
            'linkedin_url', 'twitter_url', 'order'
        ]


class ContactSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactSubmission
        fields = [
            'id', 'name', 'email', 'phone', 'inquiry_type', 
            'subject', 'message', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def validate_email(self, value):
        """Validate email format"""
        if not value:
            raise serializers.ValidationError("Email is required.")
        return value
    
    def validate_name(self, value):
        """Validate name"""
        if not value or len(value.strip()) < 2:
            raise serializers.ValidationError("Name must be at least 2 characters long.")
        return value.strip()
    
    def validate_message(self, value):
        """Validate message"""
        if not value or len(value.strip()) < 10:
            raise serializers.ValidationError("Message must be at least 10 characters long.")
        return value.strip()


class CompanyInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyInfo
        fields = [
            'id', 'company_name', 'tagline', 'description', 'address', 
            'phone', 'email', 'website', 'facebook_url', 'twitter_url', 
            'linkedin_url', 'instagram_url', 'footer_disclaimer', 'business_hours', 
            'meta_title', 'meta_description', 'meta_image', 'meta_image_alt',
            'navbar_logo', 'navbar_logo_alt', 'footer_logo', 'footer_logo_alt', 'favicon'
        ]


class CarInsuranceQuotesPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarInsuranceQuotesPage
        fields = [
            'id', 'title', 'last_updated', 'meta_title', 'meta_description', 'meta_keywords', 'intro_paragraphs', 'takeaways',
            'state_insurance_data', 'faqs', 'body_html', 'toc_items', 'video_url',
            'author_name', 'author_bio', 'author_image', 'author_context', 'updated_at'
        ]