import React from 'react';
import { useSelector } from 'react-redux';
import { IntlProvider } from 'react-intl';

import { LanguageUtils } from 'utils';

import '@formatjs/intl-pluralrules/polyfill';
import '@formatjs/intl-pluralrules/locale-data/en';
import '@formatjs/intl-pluralrules/locale-data/vi';

import '@formatjs/intl-relativetimeformat/polyfill';
import '@formatjs/intl-relativetimeformat/locale-data/en';
import '@formatjs/intl-relativetimeformat/locale-data/vi';

const IntlProviderWrapper = ({ children }) => {
    const language = useSelector(state => state.app.language);
    const messages = LanguageUtils.getFlattenedMessages();

    return (
        <IntlProvider locale={language} messages={messages[language]} defaultLocale="vi">
            {children}
        </IntlProvider>
    );
};

export default IntlProviderWrapper;
