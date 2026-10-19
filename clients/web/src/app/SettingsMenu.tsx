import { useState } from 'react';
import { LANGUAGES } from '../i18n/format';
import { MESSAGES, useI18n } from '../i18n/i18n';
import { usePreferences } from '../preferences/preferences';
import Dialog from '../ui/Dialog';
import { SettingsIcon } from '../ui/icons';
import SegmentedControl from '../ui/SegmentedControl';

export default function SettingsMenu() {
  const { language, t } = useI18n();
  const [open, setOpen] = useState(false);
  const [preferences, update] = usePreferences();

  return (
    <>
      <button type="button" className="icon-button" aria-label={t.app.settings} onClick={() => setOpen(true)}>
        <SettingsIcon />
      </button>
      <Dialog open={open} onClose={() => setOpen(false)} title={t.app.settings}>
        <div className="settings">
          {/* Each language in its own words, so that whoever cannot read this one finds theirs. */}
          <SegmentedControl
            legend={t.settings.language}
            name="language"
            value={language}
            options={LANGUAGES.map((each) => ({ value: each, label: MESSAGES[each].name, lang: each }))}
            onChange={(chosen) => update({ language: chosen })}
          />
          <SegmentedControl
            legend={t.settings.appearance}
            name="appearance"
            value={preferences.appearance}
            options={[
              { value: 'light', label: t.settings.light },
              { value: 'system', label: t.settings.automatic },
              { value: 'dark', label: t.settings.dark },
            ]}
            onChange={(appearance) => update({ appearance })}
          />
          <SegmentedControl
            legend={t.settings.mentionColours}
            name="palette"
            value={preferences.colorblind ? 'grey' : 'colour'}
            options={[
              { value: 'colour', label: t.settings.greenToRed },
              { value: 'grey', label: t.settings.shadesOfGrey },
            ]}
            onChange={(palette) => update({ colorblind: palette === 'grey' })}
            hint={t.settings.shadesOfGreyHint}
          />
          <SegmentedControl
            legend={t.settings.majorityJudgmentBallot}
            name="mjBallot"
            value={preferences.mjBallot}
            options={[
              { value: 'scale', label: t.settings.colourScale },
              { value: 'dropdown', label: t.settings.dropdowns },
            ]}
            onChange={(mjBallot) => update({ mjBallot })}
          />
          <SegmentedControl
            legend={t.settings.castingYourBallot}
            name="submission"
            value={preferences.submission}
            options={[
              { value: 'live', label: t.settings.live },
              { value: 'envelope', label: t.settings.envelope },
            ]}
            onChange={(submission) => update({ submission })}
            hint={preferences.submission === 'live' ? t.settings.liveHint : t.settings.envelopeHint}
          />
        </div>
      </Dialog>
    </>
  );
}
