import json
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def handler(event, context):
    """
    Handle WebSocket disconnections
    """
    try:
        connection_id = event['requestContext']['connectionId']
        logger.info(f"Client disconnected: {connection_id}")
        
        # In a production system, you might:
        # 1. Clean up connection info from DynamoDB
        # 2. Log session statistics
        
        return {'statusCode': 200}
        
    except Exception as e:
        logger.error(f"Error in disconnect handler: {str(e)}")
        return {'statusCode': 500}
