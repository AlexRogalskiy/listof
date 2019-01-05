from docker.errors import APIError
from flask import request, jsonify, make_response
from flask_restplus import Resource, fields, Namespace, Api
from proxy.exceptions import RequestException
from proxy.interceptor import Interceptor
from proxy.utils import validate_graphql_request, execute_graphql_request
from security.decorators import token_required

# pylint: disable=unused-variable


def register_graphql(namespace: Namespace, api: Api):
    """Method used to register the GraphQL namespace and endpoint."""

    # Create expected headers and payload
    headers = api.parser()
    payload = api.model('Payload', {'query': fields.String(
        required=True,
        description='GraphQL query or mutation',
        example='{allSysDataTypes{nodes{name}}}')})

    @namespace.route('/graphql', endpoint='with-parser')
    @namespace.doc()
    class GraphQL(Resource):
        #decorators = [token_required]

        @namespace.expect(headers, payload, validate=True)
        def post(self):
            """
            Execute GraphQL queries and mutations
            Use this endpoint to send http request to the GraphQL API.
            """
            payload = request.json

            try:
                # Validate http request payload and convert it to GraphQL document
                graphql_document = validate_graphql_request(payload['query'])

                # Verify GraphQL mutation can be handled
                interceptor = Interceptor()
                mutation_name = interceptor.get_mutation_name(graphql_document)

                # Surcharge payload before request
                if mutation_name:
                    payload['query'] = interceptor.before_request(mutation_name)

                # Execute request on GraphQL API
                status, data = execute_graphql_request(payload)
                if status != 200:
                    raise RequestException(status, data)

                # Execute custom scripts after request
                if mutation_name:
                    data = interceptor.after_request(mutation_name, data)

                return make_response(jsonify(data), status)

            except RequestException as exception:
                return exception.to_response()

            except APIError as exception:
                return make_response(jsonify({'message': exception.explanation}), exception.status_code)
