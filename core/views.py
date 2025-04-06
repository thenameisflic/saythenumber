import json
import re

from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from core.utils.number_to_english import number_to_english
from django_ratelimit.decorators import ratelimit


@csrf_exempt
@require_http_methods(["GET", "POST"])
@ratelimit(key='ip', rate='10/m')
def num_to_english(request):
    number = None
    """
    GET: /num_to_english?number=123
    POST: {"number": "123"}
    """
    if request.method == 'GET':
        number = request.GET.get('number')
    else:
        try:
            if request.content_type == 'application/json':
                data = json.loads(request.body)
                number = str(data.get('number'))
        except json.JSONDecodeError:
            return JsonResponse({
                "status": "error",
                "message": "Invalid JSON data"
            }, status=400)

    if not number:
        return JsonResponse({
            "status": "error",
            "message": "Missing 'number' parameter"
        }, status=400)

    if not re.match(r'^-?\d+\.?\d*$', number):
        return JsonResponse({
            "status": "error",
            "message": "Only numbers are allowed"
        }, status=400)

    try:
        result = number_to_english(number)
        return JsonResponse({
            "status": "ok",
            "num_in_english": result
        })
    except ValueError as e:
        return JsonResponse({
            "status": "error",
            "message": str(e)
        }, status=400)


def test_frontend(request):
    return render(request, 'index.html')


def healthcheck(request):
    return render(request, 'core/index.html')


def ratelimited_error(request, exception):
    return JsonResponse(
        {"status": "error", "message": "Rate limit exceeded. Try again later."},
        status=429
    )
