import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Common
      'common.play': 'Play',
      'common.settings': 'Settings',
      'common.home': 'Home',
      'common.back': 'Back',
      'common.done': 'Done',
      'common.continue': 'Continue',
      
      // Title
      'title.tapToPlay': 'Tap to Play',
      
      // Home
      'home.play': 'Play',
      'home.children': 'Manage Children',
      'home.stickerBook': 'Sticker Book',
      'home.farmyard': 'Farmyard',
      'home.wardrobe': 'Wardrobe',
      'home.grownups': 'Grown-ups',
      'home.backToTitle': 'Back to Title',
      
      // Play
      'play.setup.title': 'Play Setup',
      'play.setup.world': 'World',
      'play.setup.objective': 'Objective',
      'play.setup.auto': 'Auto',
      'play.setup.surprise': 'Surprise!',
      'play.setup.start': 'Start',
      
      'play.gameplay.pause': 'Pause',
      'play.gameplay.objective': 'Objective',
      'play.gameplay.finish': 'Finish',
      
      'play.results.title': 'You did it!',
      'play.results.stars': 'Stars: {{count}}',
      'play.results.stickers': 'Stickers found: {{count}}',
      
      'play.reward.title': 'Reward Reveal',
      'play.reward.added': 'Added to your collection!',
      'play.reward.adding': 'Adding to your collection...',
      
      // Settings
      'settings.audio': 'Audio',
      'settings.music': 'Music: {{value}}',
      'settings.sfx': 'SFX: {{value}}',
      'settings.haptics': 'Haptics',
      'settings.accessibility': 'Accessibility',
      'settings.reduceMotion': 'Reduce Motion',
      'settings.colorAssist': 'Color Assist',
      'settings.longPressMode': 'Long-press Mode',
      
      // Children
      'children.title': 'Children',
      'children.add': 'Add Child',
      'children.name': 'Name',
      'children.delete': 'Delete',
      
      // Grown-ups
      'grownups.title': 'Grown-ups Area',
      'grownups.description': 'This area is for parents and guardians only.',
      'grownups.enterGate': 'Enter Parent Gate',
      'grownups.privacy': 'Privacy Policy',
      'grownups.support': 'Support',
      
      'grownups.gate.title': 'Parent Gate',
      'grownups.gate.question': 'Please answer this question to continue:',
      'grownups.gate.answer': 'Answer',
      'grownups.gate.submit': 'Submit',
      'grownups.gate.incorrect': 'Incorrect answer. Please try again.',
      
      'grownups.shop.title': 'Shop',
      'grownups.shop.purchase': 'Purchase',
      
      'grownups.privacy.title': 'Privacy Policy',
      'grownups.privacy.dataCollection': 'Data Collection',
      'grownups.privacy.dataCollectionText': 'Melly Moo collects no personal information. All data is stored locally on your device. Child names are nicknames only and never shared.',
      'grownups.privacy.analytics': 'Analytics',
      'grownups.privacy.analyticsText': 'Optional analytics are device-local only. No data is uploaded without explicit parental consent.',
      'grownups.privacy.coppa': 'COPPA Compliance',
      'grownups.privacy.coppaText': 'This app is designed for children and complies with COPPA. No personal data is collected from children.',
      
      'grownups.support.title': 'Support',
      'grownups.support.description': 'Need help with Melly Moo? Contact us at support@mellymoo.com',
      'grownups.support.email': 'Send Email',
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
