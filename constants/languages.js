const LANGUAGES = {
  English: "en",
  French: "fr",
  German: "de",
  Spanish: "es",
  Portuguese: "pt",
  Polish: "pl",
  Japanese: "ja",
  Dutch: "nl",
  Korean: "ko",
  Italian: "it",
  Russian: "ru",
  Arabic: "ar",
};

const LANG_CHOICES = Object.keys(LANGUAGES).map((l) => ({
  name: l,
  value: l,
}));

module.exports = { LANGUAGES, LANG_CHOICES };
