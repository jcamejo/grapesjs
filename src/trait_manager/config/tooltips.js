const tooltips = {
  'Submit action':
    'Submit action your form. Example: if the action is redirection ...',
  'Redirection type': 'About Redirection type',
  'Redirect url': 'About Redirect url',
  'Redirection Thank_you_url type': 'About Redirection Thank_you_url type',
  'Thank you url': 'About thank you url',
  Agreed: 'About Agreed function',
  'Agreed text': 'About Agreed text',
  'Web from code (HTML)':
    'Web from code (HTML): some description about the form parser'
};

module.exports = {
  getTooltip(label) {
    if (tooltips.hasOwnProperty(label)) {
      return tooltips[label];
    }
    return label;
  }
};
