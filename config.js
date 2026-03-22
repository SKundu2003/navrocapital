// Navro Capital — Configuration
// For Netlify deployment, this can be replaced with a Netlify Function or environment variables.

const CONFIG = {
  // Admin credentials (hardcoded for demo; replace with Netlify Function for production)
  admin: {
    username: 'admin',
    password: 'navro2024'
  },

  // Contact Information
  contact: {
    name: 'Girish Bagrecha',
    phone: '+91 9731038350',
    phoneDisplay: '+91 97310 38350',
    email: 'girish.bagrecha@navrocapital.in',
    whatsappLink: 'https://wa.me/919731038350?text=Hi%20Girish%2C%20I%27m%20interested%20in%20learning%20more%20about%20investment%20opportunities.',
    meetingLink: 'https://cal.com/navrocapital-voj1ni/30min'
  },

  // AMFI Registration
  amfi: {
    arn: 'ARN-338214',
    text: 'This website is operated by an AMFI Registered Mutual Fund Distributor (ARN: ARN-338214)'
  },

  // localStorage keys
  storageKeys: {
    marketInsight: 'navro_market_insight',
    isAdmin: 'navro_is_admin'
  }
};
