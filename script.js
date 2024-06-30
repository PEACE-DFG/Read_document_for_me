document.addEventListener('DOMContentLoaded', function() {
  const fileInput = document.getElementById('fileInput');
  const textInput = document.getElementById('textInput');
  const voiceSelect = document.getElementById('voiceSelect');
  const pitch = document.getElementById('pitch');
  const rate = document.getElementById('rate');
  const speakButton = document.getElementById('speakButton');
  let voices = [];

  function populateVoiceList() {
      voices = speechSynthesis.getVoices();
      voiceSelect.innerHTML = '';
      voices.forEach((voice, index) => {
          const option = document.createElement('option');
          option.textContent = `${voice.name} (${voice.lang})`;
          option.value = index;
          voiceSelect.appendChild(option);
      });
  }

  function readText(text) {
      if (speechSynthesis.speaking) {
          speechSynthesis.cancel();
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = voices[voiceSelect.value];
      utterance.pitch = pitch.value;
      utterance.rate = rate.value;
      speechSynthesis.speak(utterance);
  }

  function handleFile(event) {
      const file = event.target.files[0];
      if (file) {
          const reader = new FileReader();
          const extension = file.name.split('.').pop().toLowerCase();

          reader.onload = function(e) {
              const content = e.target.result;

              if (extension === 'txt') {
                  textInput.value = content;
              } else if (extension === 'docx') {
                  mammoth.extractRawText({arrayBuffer: content})
                      .then(function(result) {
                          textInput.value = result.value;
                      })
                      .catch(function(err) {
                          console.error('Error reading DOCX file:', err);
                      });
              }
          };

          if (extension === 'txt') {
              reader.readAsText(file);
          } else if (extension === 'docx') {
              reader.readAsArrayBuffer(file);
          }
      }
  }

  fileInput.addEventListener('change', handleFile);

  speakButton.addEventListener('click', function() {
      const text = textInput.value;
      if (text) {
          readText(text);
      }
  });

  speechSynthesis.addEventListener('voiceschanged', populateVoiceList);
  populateVoiceList();
});
