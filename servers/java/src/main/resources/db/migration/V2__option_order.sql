-- How voters see a poll's options (Poll.OptionOrder): AS_WRITTEN, ALPHABETICAL
-- (sorted when the poll was created, so poll_option.position is that order)
-- or SHUFFLED (each voter's client shuffles them). The first places draw
-- support. Polls created before this column keep their options as written.
ALTER TABLE poll ADD COLUMN option_order VARCHAR(16) DEFAULT 'AS_WRITTEN' NOT NULL;
