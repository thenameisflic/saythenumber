from django.test import TestCase
from core.utils.number_to_english import number_to_english, SCALES

class NumberToEnglishTests(TestCase):
    def test_basic_numbers(self):
        test_cases = [
            ("0", "zero"),
            ("1", "one"),
            ("10", "ten"),
            ("11", "eleven"),
            ("20", "twenty"),
            ("21", "twenty one"),
            ("100", "one hundred"),
            ("101", "one hundred one"),
            ("110", "one hundred ten"),
            ("111", "one hundred eleven"),
            ("1000", "one thousand"),
            ("1001", "one thousand one"),
            ("1010", "one thousand ten"),
            ("1100", "one thousand one hundred"),
            ("9999", "nine thousand nine hundred ninety nine"),
        ]
        for num, expected in test_cases:
            with self.subTest(num=num, expected=expected):
                self.assertEqual(number_to_english(num), expected)

    def test_large_numbers(self):
        test_cases = [
            ("1000000", "one million"),
            ("1000001", "one million one"),
            ("1234567", "one million two hundred thirty four thousand five hundred sixty seven"),
            ("1000000000", "one billion"),
            ("1000000001", "one billion one"),
            ("987654321123", "nine hundred eighty seven billion six hundred fifty four million three hundred twenty one thousand one hundred twenty three")
        ]
        for num, expected in test_cases:
            with self.subTest(num=num, expected=expected):
                self.assertEqual(number_to_english(num), expected)

    def test_negative_numbers(self):
        test_cases = [
            ("-1", "negative one"),
            ("-21", "negative twenty one"),
            ("-100", "negative one hundred"),
            ("-1234567", "negative one million two hundred thirty four thousand five hundred sixty seven"),
        ]
        for num, expected in test_cases:
            with self.subTest(num=num, expected=expected):
                self.assertEqual(number_to_english(num), expected)

    def test_floating_point_numbers(self):
        test_cases = [
            ("0.0", "zero"),
            ("0.1", "zero point one"),
            ("0.01", "zero point zero one"),
            ("0.001", "zero point zero zero one"),
            ("0.12345", "zero point one two three four five"),
            ("1.0", "one"),
            ("1.1", "one point one"),
            ("1.01", "one point zero one"),
            ("3.14159", "three point one four one five nine"),
            ("123.456", "one hundred twenty three point four five six"),
            ("-12.34", "negative twelve point three four"),
        ]
        for num, expected in test_cases:
            with self.subTest(num=num, expected=expected):
                self.assertEqual(number_to_english(num), expected)

    def test_max_supported_number(self):
        max_num = str(10**(len(SCALES) * 3) - 1)
        self.assertIn(SCALES[len(SCALES) - 1], number_to_english(max_num))

    def test_above_max_supported_number(self):
        with self.assertRaises(ValueError):
            number_to_english(str(10**(len(SCALES) * 3) + 1))

    def test_zeros_in_middle(self):
        test_cases = [
            ("100", "one hundred"),
            ("1000", "one thousand"),
            ("1000000", "one million"),
        ]
        for num, expected in test_cases:
            with self.subTest(num=num, expected=expected):
                self.assertEqual(number_to_english(num), expected)

    def test_very_small_decimals(self):
        test_cases = [
            ("0.000001", "zero point zero zero zero zero zero one"),
            ("0.000000001", "zero point zero zero zero zero zero zero zero zero one"),
        ]
        for num, expected in test_cases:
            with self.subTest(num=num, expected=expected):
                self.assertEqual(number_to_english(num), expected)

    def test_trailing_zeros(self):
        self.assertEqual(number_to_english("1.200"), "one point two")
        self.assertEqual(number_to_english("0.100"), "zero point one")
        self.assertEqual(number_to_english("3.000"), "three")

    def test_floating_point_upper_bound(self):
        expected = "ninety nine quadrillion nine hundred ninety nine trillion nine hundred ninety nine billion nine hundred ninety nine million nine hundred ninety nine thousand nine hundred ninety nine"
        self.assertEqual(number_to_english("99999999999999999.0"), expected)
