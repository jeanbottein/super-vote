package org.supervote.server.polls;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/** The order of an alphabetical poll's options: A to Z as people read a list. */
class NaturalOrderTest {

    @Test
    void lettersWhateverTheirCaseAndAccents() {
        assertThat(sorted("banana", "Cherry", "apple", "École", "eau"))
            .containsExactly("apple", "banana", "Cherry", "eau", "École");
    }

    @Test
    void numbersByTheirValue() {
        assertThat(sorted("Room 10", "Room 9", "Room 1", "Room 100"))
            .containsExactly("Room 1", "Room 9", "Room 10", "Room 100");
    }

    @Test
    void timesAndDatesWrittenYearFirstInTheirOrder() {
        assertThat(sorted("14:15", "9:30", "10:00")).containsExactly("9:30", "10:00", "14:15");
        assertThat(sorted("2026-11-03", "2026-10-24", "2026-10-03"))
            .containsExactly("2026-10-03", "2026-10-24", "2026-11-03");
    }

    @Test
    void numbersOfAnyLength() {
        assertThat(sorted("99999999999999999999 votes", "100000000000000000000 votes", "7 votes"))
            .containsExactly("7 votes", "99999999999999999999 votes", "100000000000000000000 votes");
    }

    @Test
    void numbersBeforeLetters() {
        assertThat(sorted("Option B", "Option 2", "Option A")).containsExactly("Option 2", "Option A", "Option B");
    }

    /** Equal as people read them, they still sort the same way every time. */
    @Test
    void labelsThatReadTheSameKeepAFixedOrder() {
        assertThat(sorted("Room 01", "Room 1")).isEqualTo(sorted("Room 1", "Room 01"));
        assertThat(sorted("cafe", "Café", "CAFE")).isEqualTo(sorted("CAFE", "cafe", "Café"));
    }

    private static List<String> sorted(String... labels) {
        return List.of(labels).stream().sorted(NaturalOrder.INSTANCE).toList();
    }
}
