export const siteSeo = {
  siteUrl: 'https://dofupdate.com.br',
  siteName: 'DOF Update',
  locale: 'pt_BR',
  title: 'DOF Update 2026 | Imersão em DTM e Dores Orofaciais em Vitória/ES',
  shortTitle: 'DOF Update 2026',
  description:
    'DOF Update 2026 — III Imersão Interprofissional em DTM e Dores Orofaciais. Evento presencial em 03/10/2026 no Auditório da FAESA, Vitória/ES, com pré-evento em 02/10. Atualização científica para dentistas, fisioterapeutas, fonoaudiólogos, médicos e estudantes.',
  keywords: [
    'DOF Update 2026',
    'DTM',
    'dores orofaciais',
    'dor orofacial',
    'disfunção temporomandibular',
    'imersão interprofissional',
    'Vitória ES',
    'FAESA',
    'odontologia do sono',
    'fisioterapia DTM',
    'fonoaudiologia DTM',
    'evento presencial DTM'
  ],
  imagePath: '/og-dof-update-2026.jpg',
  logoPath: '/dof-update-logo.png',
  faviconPath: '/favicon.ico',
  themeColor: '#000000',
  event: {
    name: 'DOF Update 2026',
    alternateName: 'III Imersão Interprofissional em DTM e Dores Orofaciais',
    startDate: '2026-10-03',
    endDate: '2026-10-03',
    doorTime: '2026-10-03T07:30:00-03:00',
    startDateTime: '2026-10-03T08:00:00-03:00',
    endDateTime: '2026-10-03T18:45:00-03:00',
    preEventDate: '2026-10-02',
    preEventName: 'Workshop de Tecnologias para Dor',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      name: 'Auditório da FAESA',
      streetAddress: 'Av. Vitória, 2220 - Monte Belo',
      addressLocality: 'Vitória',
      addressRegion: 'ES',
      postalCode: '29053-360',
      addressCountry: 'BR'
    },
    offersLowPrice: 230,
    offersHighPrice: 380,
    priceCurrency: 'BRL',
    validThrough: '2026-10-01'
  }
} as const;

export function resolveSiteUrl(envSiteUrl?: string): string {
  const value = envSiteUrl?.trim();
  if (!value) {
    return siteSeo.siteUrl;
  }
  return value.replace(/\/$/, '');
}

export function buildEventJsonLd(siteUrl: string = siteSeo.siteUrl) {
  const { event } = siteSeo;
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.name,
    alternateName: event.alternateName,
    description: siteSeo.description,
    image: [`${siteUrl}${siteSeo.imagePath}`, `${siteUrl}${siteSeo.logoPath}`],
    url: `${siteUrl}/`,
    eventAttendanceMode: event.eventAttendanceMode,
    eventStatus: event.eventStatus,
    startDate: event.startDateTime,
    endDate: event.endDateTime,
    doorTime: event.doorTime,
    eventSchedule: [
      {
        '@type': 'Schedule',
        name: event.preEventName,
        startDate: event.preEventDate,
        description: 'Pré-evento presencial no Auditório da FAESA.'
      },
      {
        '@type': 'Schedule',
        name: event.name,
        startDate: event.startDate,
        endDate: event.endDate
      }
    ],
    location: {
      '@type': 'Place',
      name: event.location.name,
      address: {
        '@type': 'PostalAddress',
        streetAddress: event.location.streetAddress,
        addressLocality: event.location.addressLocality,
        addressRegion: event.location.addressRegion,
        postalCode: event.location.postalCode,
        addressCountry: event.location.addressCountry
      }
    },
    organizer: {
      '@type': 'Organization',
      name: siteSeo.siteName,
      url: `${siteUrl}/`
    },
    offers: {
      '@type': 'AggregateOffer',
      url: `${siteUrl}/#offer`,
      priceCurrency: event.priceCurrency,
      lowPrice: event.offersLowPrice,
      highPrice: event.offersHighPrice,
      availability: 'https://schema.org/InStock',
      validThrough: event.validThrough
    },
    inLanguage: 'pt-BR',
    isAccessibleForFree: false
  };
}

export function buildOrganizationJsonLd(siteUrl: string = siteSeo.siteUrl) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteSeo.siteName,
    url: `${siteUrl}/`,
    logo: `${siteUrl}${siteSeo.logoPath}`,
    description:
      'DOF Update é uma imersão interprofissional em DTM, dores orofaciais, sono e prática clínica baseada em evidências.'
  };
}

export function buildWebSiteJsonLd(siteUrl: string = siteSeo.siteUrl) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteSeo.siteName,
    url: `${siteUrl}/`,
    inLanguage: 'pt-BR',
    description: siteSeo.description,
    publisher: {
      '@type': 'Organization',
      name: siteSeo.siteName,
      logo: `${siteUrl}${siteSeo.logoPath}`
    }
  };
}
