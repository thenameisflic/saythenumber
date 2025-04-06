import json

from core.views import num_to_english

from unittest.mock import patch
from django.test import TestCase, RequestFactory
import re


class NumToEnglishViewTests(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def test_get_valid_number(self):
        request = self.factory.get('/num_to_english', {'number': '123'})
        response = num_to_english(request)

        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(
            str(response.content, encoding='utf8'),
            {
                "status": "ok",
                "num_in_english": "one hundred twenty three"
            }
        )

    def test_get_missing_number(self):
        request = self.factory.get('/num_to_english')
        response = num_to_english(request)

        self.assertEqual(response.status_code, 400)
        self.assertJSONEqual(
            str(response.content, encoding='utf8'),
            {
                "status": "error",
                "message": "Missing 'number' parameter"
            }
        )

    def test_get_invalid_number_format(self):
        request = self.factory.get('/num_to_english', {'number': 'abc'})
        response = num_to_english(request)

        self.assertEqual(response.status_code, 400)
        self.assertJSONEqual(
            str(response.content, encoding='utf8'),
            {
                "status": "error",
                "message": "Only numbers are allowed"
            }
        )

    def test_post_valid_number(self):
        request = self.factory.post(
            '/num_to_english',
            {'number': '123'}
        )
        response = num_to_english(request)

        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(
            str(response.content, encoding='utf8'),
            {
                "status": "ok",
                "num_in_english": "one hundred twenty three"
            }
        )

    def test_post_json_valid_number(self):
        request = self.factory.post(
            '/num_to_english',
            data={"number": 123}
        )
        response = num_to_english(request)

        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(
            str(response.content, encoding='utf8'),
            {
                "status": "ok",
                "num_in_english": "one hundred twenty three"
            }
        )

    def test_post_missing_number(self):
        request = self.factory.post('/num_to_english')
        response = num_to_english(request)

        self.assertEqual(response.status_code, 400)
        self.assertJSONEqual(
            str(response.content, encoding='utf8'),
            {
                "status": "error",
                "message": "Missing 'number' parameter"
            }
        )

    def test_post_invalid_number_format(self):
        request = self.factory.post(
            '/num_to_english',
            {'number': 'abc'}
        )
        response = num_to_english(request)

        self.assertEqual(response.status_code, 400)
        self.assertJSONEqual(
            str(response.content, encoding='utf8'),
            {
                "status": "error",
                "message": "Only numbers are allowed"
            }
        )

    @patch('core.views.number_to_english')
    def test_conversion_error(self, mock_number_to_english):
        mock_number_to_english.side_effect = ValueError("Number out of range")

        request = self.factory.get('/num_to_english', {'number': '123'})
        response = num_to_english(request)

        response_data = json.loads(response.content.decode('utf-8'))

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response_data['status'], 'error')
        self.assertEqual(response_data['message'], 'Number out of range')
        mock_number_to_english.assert_called_once_with('123')

    def test_unsupported_methods(self):
        methods = ['put', 'delete', 'patch', 'head']
        for method in methods:
            request = getattr(self.factory, method)('/num_to_english')
            response = num_to_english(request)
            self.assertEqual(response.status_code, 405)

    def test_number_regex_validation(self):
        valid_numbers = ['123', '-123', '123.45', '0', '-0.5']
        invalid_numbers = ['abc', '123a', '1.2.3', '']

        for number in valid_numbers:
            self.assertTrue(re.match(r'^-?\d+\.?\d*$', number))

        for number in invalid_numbers:
            self.assertFalse(re.match(r'^-?\d+\.?\d*$', number))
