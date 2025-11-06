from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Category

@api_view(['GET'])
def states_list(request):
    try:
        main_category = Category.objects.get(name="States", type="main")
        states = main_category.subcategories.all()
        data = [
            {"id": s.id, "name": s.name, "slug": s.slug} for s in states
        ]
        return Response(data)
    except Category.DoesNotExist:
        return Response([])
