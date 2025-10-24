const fs = require('fs');
const sdk = require('microsoft-cognitiveservices-speech-sdk');
const { SUBSCRIPTION_KEY, REGION } = require('../config/configuration');

async function asses(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: 'no file uploaded' });
  }

  try {
    const { reference_text } = req.body;
    const audioPath = req.file.path;
    const audioBuffer = fs.readFileSync(audioPath);

    // Azure Speech Service setup
    const speechConfig = sdk.SpeechConfig.fromSubscription(SUBSCRIPTION_KEY, REGION);
    speechConfig.speechRecognitionLanguage = 'de-DE'; // German language

    // Validate input
    if (!reference_text || reference_text.trim().length === 0) {
      return res.status(400).json({ error: 'reference text required' });
    }

    // Audio and assessment config
    const audioConfig = sdk.AudioConfig.fromWavFileInput(audioBuffer);

    const pronunciationAssessmentConfig = new sdk.PronunciationAssessmentConfig(
      reference_text,
      sdk.PronunciationAssessmentGradingSystem.HundredMark,
      sdk.PronunciationAssessmentGranularity.Phoneme,
      true
    );

    // Disable prosody for non-English locales
    pronunciationAssessmentConfig.enableProsodyAssessment = false;

    // Create recognizer
    const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
    pronunciationAssessmentConfig.applyTo(recognizer);

    // Single-shot recognition (preferred for assessment)
    recognizer.recognizeOnceAsync(
      (result) => {
        if (result.reason === sdk.ResultReason.RecognizedSpeech) {
          const assessment = sdk.PronunciationAssessmentResult.fromResult(result);

          const finalResult = {
            recognizedText: result.text,
            accuracyScore: assessment.accuracyScore,
            fluencyScore: assessment.fluencyScore,
            completenessScore: assessment.completenessScore,
            pronunciationScore: assessment.pronunciationScore,
          };

          console.log('German Pronunciation Assessment:', finalResult);

          fs.unlinkSync(audioPath);

          return res.json({
            message: 'German pronunciation assessment completed successfully.',
            result: finalResult,
          });
        } else if (result.reason === sdk.ResultReason.NoMatch) {
          fs.unlinkSync(audioPath);
          return res.status(400).json({
            error: 'No recognizable speech detected in the audio.',
          });
        }
      },
      (err) => {
        console.error('Recognition failed:', err);
        fs.unlinkSync(audioPath);
        return res.status(500).json({ error: 'Recognition failed', details: err });
      }
    );
  } catch (err) {
    console.error('Error in German assessment:', err);
    return res.status(500).json({ error: 'Failed to process German audio', details: err });
  }
}

module.exports = { asses };
