"""
Utility functions for API responses
"""
from rest_framework.response import Response
from rest_framework import status


def api_response(data=None, message="Success", status_code=status.HTTP_200_OK):
    """Standardized API response format"""
    response_data = {
        'success': 200 <= status_code < 300,
        'message': message,
    }
    
    if data is not None:
        response_data['data'] = data
    
    return Response(response_data, status=status_code)
