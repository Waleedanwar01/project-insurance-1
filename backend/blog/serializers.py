from rest_framework import serializers
from .models import BlogPost, BlogImage, Category, BlogFeedback

class BlogImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogImage
        fields = ('id', 'image', 'caption', 'uploaded_at')

class CategorySerializer(serializers.ModelSerializer):
    parent = serializers.SlugRelatedField(read_only=True, slug_field='slug')
    parent_name = serializers.CharField(source='parent.name', read_only=True)
    type = serializers.CharField(read_only=True)
    class Meta:
        model = Category
        fields = ('id', 'name', 'slug', 'type', 'parent', 'parent_name')

class BlogPostListSerializer(serializers.ModelSerializer):
    feature_image = serializers.ImageField()
    author_image = serializers.ImageField(required=False, allow_null=True)
    author = serializers.StringRelatedField()
    category = CategorySerializer()

    class Meta:
        model = BlogPost
        fields = (
            'id', 'title', 'slug', 'summary', 'feature_image', 'published_at', 'author', 'category',
            'views', 'helpful_count', 'not_helpful_count', 'author_name', 'author_bio', 'author_image'
        )

class BlogPostDetailSerializer(serializers.ModelSerializer):
    feature_image = serializers.ImageField()
    additional_images = BlogImageSerializer(many=True)
    author_image = serializers.ImageField(required=False, allow_null=True)
    author = serializers.StringRelatedField()
    category = CategorySerializer()

    class Meta:
        model = BlogPost
        fields = '__all__'
        read_only_fields = ('published_at','updated_at','views', 'helpful_count', 'not_helpful_count')

class BlogFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogFeedback
        fields = ['is_helpful', 'comment']
    
    def create(self, validated_data):
        # Get IP address from request
        request = self.context.get('request')
        if request:
            ip_address = request.META.get('REMOTE_ADDR')
            validated_data['ip_address'] = ip_address
        return super().create(validated_data)
