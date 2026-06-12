import Sound from 'react-native-sound';

// Enable playback in silence mode
Sound.setCategory('Playback');

type SoundEffect = 
  | 'launchgame' 
  | 'GameStart' 
  | 'touch' 
  | 'transaction' 
  | 'whoosh' 
  | 'wompwomp'
  | 'finish';

// Pre-load all sounds to avoid lag on first play
const sounds: Record<SoundEffect, Sound | null> = {
  launchgame: null,
  GameStart: null,
  touch: null,
  transaction: null,
  whoosh: null,
  wompwomp: null,
  finish: null,
};

export const initSounds = () => {
  sounds.launchgame = new Sound('launchgame.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) console.log('failed to load launchgame.mp3', error);
    else sounds.launchgame?.setVolume(1.0);
  });
  sounds.GameStart = new Sound('gamestart.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) console.log('failed to load gamestart.mp3', error);
    else sounds.GameStart?.setVolume(1.0);
  });
  sounds.touch = new Sound('touch.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) console.log('failed to load touch.mp3', error);
    else sounds.touch?.setVolume(1.0);
  });
  sounds.transaction = new Sound('transaction.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) console.log('failed to load transaction.mp3', error);
    else sounds.transaction?.setVolume(1.0);
  });
  sounds.whoosh = new Sound('whoosh.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) console.log('failed to load whoosh.mp3', error);
    else sounds.whoosh?.setVolume(1.0);
  });
  sounds.wompwomp = new Sound('wompwomp.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) console.log('failed to load wompwomp.mp3', error);
    else sounds.wompwomp?.setVolume(1.0);
  });
  sounds.finish = new Sound('finish.wav', Sound.MAIN_BUNDLE, (error) => {
    if (error) console.log('failed to load finish.wav', error);
    else sounds.finish?.setVolume(1.0);
  });
};

export const playSound = (effect: SoundEffect) => {
  const sound = sounds[effect];
  if (sound) {
    sound.setVolume(1.0);

    // For longer/ambient sounds, avoid interrupting to prevent popping noise
    const nonInterruptible: SoundEffect[] = ['wompwomp', 'finish', 'launchgame', 'GameStart'];
    
    if (sound.isPlaying()) {
      if (nonInterruptible.includes(effect)) {
        return; 
      }
      // For short repeatable sounds (transaction, touch, whoosh), 
      // just rewinding seamlessly allows spamming without dropping playback
      sound.setCurrentTime(0);
      return;
    }

    sound.play((success) => {
      if (!success) {
        // Playback failed (e.g., interrupted by a phone call).
        // Reset the sound so future plays work correctly.
        sound.reset();
      }
    });
  }
};
