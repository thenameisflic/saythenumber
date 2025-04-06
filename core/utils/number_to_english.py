UNITS = {
    0: 'zero', 1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five',
    6: 'six', 7: 'seven', 8: 'eight', 9: 'nine'
}

TEENS = {
    10: 'ten', 11: 'eleven', 12: 'twelve', 13: 'thirteen',
    14: 'fourteen', 15: 'fifteen', 16: 'sixteen',
    17: 'seventeen', 18: 'eighteen', 19: 'nineteen'
}

TENS = {
    20: 'twenty', 30: 'thirty', 40: 'forty', 50: 'fifty',
    60: 'sixty', 70: 'seventy', 80: 'eighty', 90: 'ninety'
}

# To support bigger numbers, just add new scales -- the algorithm automatically adapts
SCALES = ['', 'thousand', 'million', 'billion', 'trillion', 'quadrillion', 'quintillion']
MAX_NAMED_SCALE = len(SCALES) - 1


def convert_less_than_one_thousand(n):
    if n == 0:
        return ''
    parts = []

    hundreds = n // 100
    if hundreds > 0:
        parts.append(UNITS[hundreds] + ' hundred')
        n %= 100

    if n >= 20:
        tens = (n // 10) * 10
        parts.append(TENS[tens])
        n %= 10
        if n > 0:
            parts.append(UNITS[n])
    elif 10 <= n <= 19:
        parts.append(TEENS[n])
    elif n > 0:
        parts.append(UNITS[n])

    return ' '.join(parts)


def convert_integer_part(n):
    if n == 0:
        return UNITS[0]

    chunks = []
    while n > 0:
        chunks.append(n % 1000)
        n = n // 1000

    if len(chunks) > len(SCALES):
        raise ValueError(f"Number too large - maximum supported is 10^{3 * len(SCALES)}")

    words = []
    for i in range(len(chunks)):
        chunk = chunks[i]
        if chunk != 0:
            chunk_words = convert_less_than_one_thousand(chunk)
            if SCALES[i]:
                chunk_words += f" {SCALES[i]}"
            words.append(chunk_words)

    words.reverse()
    return ' '.join(words)


"""
Convert a number string into its human-readable version.
We need to use a string input because Python floats only support up to 15 significant decimal digits before rounding.
"""
def number_to_english(num: str):
    # Accept 1_000_000-like inputs for easier testing
    num = num.replace("_", "")

    num = num.strip()
    if not num:
        raise ValueError("Empty string input")

    # Check for negative
    is_negative = num.startswith('-')
    if is_negative:
        num = num[1:]

    # Split integer and fractional parts
    if '.' in num:
        int_part_str, frac_part_str = num.split('.', 1)
        frac_part_str = frac_part_str.rstrip('0')
    else:
        int_part_str, frac_part_str = num, ''

    int_part = int(int_part_str)
    words = []

    # Handle integer part
    if int_part == 0 and not frac_part_str:
        words.append(UNITS[0])
    else:
        if int_part != 0:
            words.append(convert_integer_part(int_part))

    # Handle fractional part
    if frac_part_str:
        if len(words) == 0:
            words.append(UNITS[0])
        words.append('point')
        words.extend(UNITS[int(d)] for d in frac_part_str)

    # Combine results
    result = ' '.join(words)
    if is_negative:
        result = f"negative {result}"

    # uncomment for british-style hyphens (will break tests)
    # result = result.replace('ty ', 'ty-')
    return result
