from rest_framework import serializers
from .models import FAQ, FAQCategory, FAQFeedback


class FAQCategorySerializer(serializers.ModelSerializer):
    faq_count = serializers.SerializerMethodField()

    class Meta:
        model = FAQCategory
        fields = ('id', 'name', 'slug', 'description', 'icon', 'order', 'faq_count')

    def get_faq_count(self, obj):
        return obj.get_faq_count()


class FAQListSerializer(serializers.ModelSerializer):
    category = FAQCategorySerializer(read_only=True)
    tags_list = serializers.SerializerMethodField()
    helpfulness_percentage = serializers.SerializerMethodField()

    class Meta:
        model = FAQ
        fields = (
            'id', 'question', 'slug', 'short_answer', 'category', 
            'priority', 'tags_list', 'is_featured', 'views', 
            'helpful_count', 'not_helpful_count', 'helpfulness_percentage',
            'created_at', 'updated_at'
        )

    def get_tags_list(self, obj):
        return obj.get_tags_list()

    def get_helpfulness_percentage(self, obj):
        return obj.get_helpfulness_percentage()


class FAQDetailSerializer(serializers.ModelSerializer):
    category = FAQCategorySerializer(read_only=True)
    tags_list = serializers.SerializerMethodField()
    helpfulness_percentage = serializers.SerializerMethodField()

    class Meta:
        model = FAQ
        fields = (
            'id', 'question', 'slug', 'answer', 'short_answer', 
            'category', 'priority', 'tags_list', 'is_featured', 
            'views', 'helpful_count', 'not_helpful_count', 
            'helpfulness_percentage', 'created_at', 'updated_at'
        )

    def get_tags_list(self, obj):
        return obj.get_tags_list()

    def get_helpfulness_percentage(self, obj):
        return obj.get_helpfulness_percentage()


class FAQFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQFeedback
        fields = ('id', 'faq', 'is_helpful', 'comment', 'created_at')
        read_only_fields = ('ip_address', 'created_at')

    def create(self, validated_data):
        # Get IP address from request
        request = self.context.get('request')
        if request:
            validated_data['ip_address'] = self.get_client_ip(request)
        return super().create(validated_data)

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip