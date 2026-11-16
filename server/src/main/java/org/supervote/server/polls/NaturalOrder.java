package org.supervote.server.polls;

import java.text.Collator;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.regex.MatchResult;
import java.util.regex.Pattern;

/**
 * A to Z as people read a list: letters whatever their case and accents, and
 * the numbers in a label by their value. "Room 9" comes before "Room 10",
 * "9:30" before "10:00", and dates written year first (2026-10-24) in the
 * order of the calendar. Labels that read the same keep a fixed order.
 */
enum NaturalOrder implements Comparator<String> {

    INSTANCE;

    /** A label's parts: runs of digits, and runs of anything else. */
    private static final Pattern PARTS = Pattern.compile("[0-9]+|[^0-9]+");

    @Override
    public int compare(String a, String b) {
        // Collators cannot be shared between threads: each comparison has its own.
        var letters = collator(Collator.PRIMARY);
        var left = parts(a);
        var right = parts(b);
        for (int i = 0; i < Math.min(left.size(), right.size()); i++) {
            var order = isNumber(left.get(i)) && isNumber(right.get(i))
                ? compareNumbers(left.get(i), right.get(i))
                : letters.compare(left.get(i), right.get(i));
            if (order != 0) {
                return order;
            }
        }
        if (left.size() != right.size()) {
            return Integer.compare(left.size(), right.size());
        }
        var order = collator(Collator.TERTIARY).compare(a, b);
        return order != 0 ? order : a.compareTo(b);
    }

    /** By value, however many digits: leading zeros aside, the longer number is the larger. */
    private static int compareNumbers(String a, String b) {
        var x = withoutLeadingZeros(a);
        var y = withoutLeadingZeros(b);
        return x.length() != y.length() ? Integer.compare(x.length(), y.length()) : x.compareTo(y);
    }

    private static List<String> parts(String label) {
        return PARTS.matcher(label).results().map(MatchResult::group).toList();
    }

    private static boolean isNumber(String part) {
        return part.charAt(0) >= '0' && part.charAt(0) <= '9';
    }

    private static String withoutLeadingZeros(String number) {
        var start = 0;
        while (start < number.length() - 1 && number.charAt(start) == '0') {
            start++;
        }
        return number.substring(start);
    }

    private static Collator collator(int strength) {
        var collator = Collator.getInstance(Locale.ROOT);
        collator.setStrength(strength);
        return collator;
    }
}
