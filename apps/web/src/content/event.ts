export interface AudienceItem {
  title: string;
  description: string;
}

export interface ScientificPillar {
  title: string;
  description: string;
  focus: string;
}

export interface ProgramBlock {
  date: string;
  title: string;
  time: string;
  description: string;
  agenda: string[];
}

export interface SpeakerPlaceholder {
  name: string;
  specialty: string;
  bio: string;
  topic: string;
  image: string | null;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface TicketCategory {
  name: string;
  price: string;
  validUntil: string;
  badge?: string;
}

export const eventContent = {
  name: 'DOF Update 2026',
  edition: 'III Imersão Interprofissional em DTM e Dores Orofaciais',
  promise: 'Uma imersão interprofissional para transformar evidência científica em decisões clínicas mais seguras.',
  intro:
    'Um encontro presencial para profissionais que desejam aprofundar sua atuação em Disfunções Temporomandibulares, Dores Orofaciais, Sono e abordagens interprofissionais.',
  date: '03 de outubro de 2026',
  time: '7h30 às 18h45',
  venue: 'Auditório da FAESA',
  city: 'Vitória, ES',
  price: 'R$ 320',
  lot: 'Último lote',
  format: '100% presencial',
  noRecording: 'Não haverá transmissão online nem disponibilização posterior das palestras.',
  themes: ['DTM', 'Dor Orofacial', 'Sono', 'Neurofisiologia', 'Farmacologia', 'Prática Clínica'],
  primaryCta: 'GARANTIR MINHA VAGA',
  ctaMicrocopy: 'Você fará um cadastro rápido e seguirá para a inscrição oficial.',
  scarcityNote: 'Valores por categoria disponíveis até 01/10/2026 ou enquanto houver vagas.',
  even3RegistrationUrl:
    'https://www.even3.com.br/dof-update-iii-imersao-interprofissional-em-dtm-e-dores-orofaciais-698642/',
  ticketValidity: 'até 01/10/2026',
  ticketCategories: [
    {
      name: 'Profissionais',
      price: 'R$320,00',
      validUntil: 'até 01/10/2026'
    },
    {
      name: 'Aluno de graduação',
      price: 'R$230,00',
      validUntil: 'até 01/10/2026'
    },
    {
      name: 'Profissionais sócios adimplentes ABRAFITO',
      price: 'R$272,00',
      validUntil: 'até 01/10/2026'
    },
    {
      name: 'Profissionais evento + pré-evento',
      price: 'R$380,00',
      validUntil: 'até 01/10/2026',
      badge: 'Últimas vagas'
    },
    {
      name: 'Alunos de graduação evento + pré-evento',
      price: 'R$290,00',
      validUntil: 'até 01/10/2026'
    },
    {
      name: 'Profissionais sócios adimplentes ABRAFITO evento + pré-evento',
      price: 'R$332,00',
      validUntil: 'até 01/10/2026'
    }
  ] satisfies TicketCategory[],
  whyParticipate:
    'DTM, dores orofaciais e distúrbios relacionados ao sono envolvem condições complexas e multifatoriais. O DOF Update 2026 aproxima diferentes áreas da saúde em torno de um mesmo objetivo: compreender melhor o paciente e tomar decisões clínicas mais seguras, atuais e fundamentadas em evidências.',
  audience: [
    {
      title: 'Cirurgiões-dentistas',
      description:
        'Para profissionais que atuam ou desejam aprofundar seus conhecimentos em DTM, dor orofacial, sono, diagnóstico e manejo de pacientes com quadros complexos.'
    },
    {
      title: 'Fisioterapeutas',
      description:
        'Para quem acompanha pacientes com dor musculoesquelética, alterações funcionais, DTM e condições crônicas.'
    },
    {
      title: 'Fonoaudiólogos e Audiologia',
      description:
        'Para profissionais que lidam com funções orofaciais, mastigação, deglutição, sono e sintomas que podem estar associados à DTM.'
    },
    {
      title: 'Médicos',
      description:
        'Para profissionais interessados na compreensão multidimensional da dor, sono, farmacologia, diagnóstico diferencial e manejo integrado.'
    },
    {
      title: 'Estudantes e profissionais em formação',
      description:
        'Para quem deseja contato com uma abordagem atual e baseada em evidências desde o início da formação.'
    }
  ] satisfies AudienceItem[],
  pillars: [
    {
      title: 'Diagnóstico e DTM',
      description: 'Avaliação clínica, critérios diagnósticos e tomada de decisão em casos de DTM.',
      focus: 'Raciocínio clínico, diagnóstico diferencial e escolha de condutas.'
    },
    {
      title: 'Dor Orofacial e Neurofisiologia',
      description: 'Mecanismos envolvidos na dor e como esse conhecimento influencia a abordagem clínica.',
      focus: 'Dor aguda e crônica, sensibilização e manejo de quadros complexos.'
    },
    {
      title: 'Sono e Dor Crônica',
      description: 'Visão integrada sobre sono, dor e condições que impactam a qualidade de vida.',
      focus: 'Distúrbios do sono, dor persistente e abordagem interprofissional.'
    },
    {
      title: 'Farmacologia e Tratamentos Contemporâneos',
      description: 'Recursos terapêuticos e estratégias utilizadas no manejo da dor orofacial.',
      focus: 'Indicações, limites e aplicabilidade clínica baseada em evidências.'
    },
    {
      title: 'Cuidado Interprofissional',
      description: 'Como diferentes áreas podem contribuir para o cuidado do mesmo paciente.',
      focus: 'Integração, comunicação clínica, encaminhamento e redes profissionais.'
    }
  ] satisfies ScientificPillar[],
  program: [
    {
      date: '02 de outubro de 2026',
      title: 'Workshop de Tecnologias para Dor',
      time: '18h30 às 20h30',
      description:
        'Uma experiência prática e demonstrativa voltada para tecnologias e tratamentos adjuvantes utilizados no manejo da dor.',
      agenda: [
        '18h30 - Abertura e apresentação',
        '[HORÁRIO] - [TEMA / TECNOLOGIA] - [PALESTRANTE / SPEAKER]',
        '[HORÁRIO] - [TEMA / TECNOLOGIA] - [PALESTRANTE / SPEAKER]',
        '20h30 - Encerramento'
      ]
    },
    {
      date: '03 de outubro de 2026',
      title: 'III Imersão Interprofissional em DTM e Dores Orofaciais',
      time: '7h30 às 18h45',
      description:
        'Um dia inteiro de atualização científica e discussão clínica com diferentes especialidades reunidas em torno de DTM, dores orofaciais, sono e cuidado interprofissional.',
      agenda: [
        '07h30 - Credenciamento',
        '[HORÁRIO] - [TÍTULO DA PALESTRA] - [PALESTRANTE 01]',
        '[HORÁRIO] - Intervalo',
        '[HORÁRIO] - [PALESTRA / MESA / DISCUSSÃO]',
        '18h45 - Encerramento'
      ]
    }
  ] satisfies ProgramBlock[],
  speakers: Array.from({ length: 6 }, (_, index) => ({
    name: `[PALESTRANTE ${String(index + 1).padStart(2, '0')}]`,
    specialty: '[ESPECIALIDADE / TITULAÇÃO]',
    bio: '[MINI BIO]',
    topic: '[TEMA]',
    image: null
  })) satisfies SpeakerPlaceholder[],
  differentiators: [
    'Ciência conectada à realidade clínica',
    'Diferentes especialidades no mesmo ambiente',
    'Espaço para troca, perguntas e conexões profissionais',
    'Experiência exclusivamente presencial',
    'Conteúdo ao vivo, sem gravação posterior'
  ],
  workshopNotice:
    'A inscrição no DOF Update 2026 não garante automaticamente uma vaga no workshop. Para participar, é necessário estar inscrito no evento principal e realizar uma inscrição específica. O valor do workshop é cobrado à parte, com vagas limitadas.',
  groupOffer: {
    title: 'Condições especiais para grupos',
    items: ['5 participantes - 10% de desconto', '10 participantes - 15% de desconto'],
    cta: 'Quero saber sobre inscrições em grupo',
    url: 'https://forms.gle/aSKo8XbHoPgSzHXn9'
  },
  refundPolicy:
    'Até 30 dias antes da realização do evento, solicitações formais por e-mail podem receber devolução de 90% do valor da inscrição. Após esse período, as inscrições poderão ser canceladas sem reembolso.',
  location: {
    title: 'Onde acontece o DOF Update 2026',
    address: 'Av. Vitória, 2220 - Monte Belo, Vitória - ES, 29053-360',
    mapEmbedUrl:
      'https://www.google.com/maps?q=Av.%20Vit%C3%B3ria%2C%202220%20-%20Monte%20Belo%2C%20Vit%C3%B3ria%20-%20ES%2C%2029053-360&output=embed',
    mapsDirectionsUrl:
      'https://www.google.com/maps/dir/?api=1&destination=Av.%20Vit%C3%B3ria%2C%202220%20-%20Monte%20Belo%2C%20Vit%C3%B3ria%20-%20ES%2C%2029053-360',
    guidance:
      'Planeje deslocamento, hospedagem e estacionamento com antecedência. Não listamos hotéis específicos enquanto não houver recomendação oficial verificada.'
  },
  faqs: [
    {
      question: 'Quando acontece o DOF Update 2026?',
      answer:
        'O evento principal acontece em 03 de outubro de 2026, das 7h30 às 18h45, no Auditório da FAESA, em Vitória/ES.'
    },
    {
      question: 'O evento é presencial?',
      answer: 'Sim. O DOF Update 2026 é 100% presencial e não terá transmissão online.'
    },
    {
      question: 'Qual é o valor da inscrição?',
      answer:
        'Os valores variam por categoria: profissionais, alunos de graduação, sócios adimplentes ABRAFITO e combos com o pré-evento. Os valores exibidos são válidos até 01/10/2026 ou enquanto houver vagas.'
    },
    {
      question: 'O pagamento é feito nesta página?',
      answer: 'Não. O pagamento é concluído na plataforma oficial de inscrição, Even3.'
    },
    {
      question: 'A inscrição no evento inclui o workshop?',
      answer:
        'Não. O Workshop de Tecnologias para Dor possui inscrição específica, vagas limitadas e valor cobrado à parte.'
    },
    {
      question: 'Como funciona a política de reembolso?',
      answer:
        'Até 30 dias antes da realização do evento, solicitações formais por e-mail podem receber devolução de 90% do valor da inscrição. Após esse período, as inscrições poderão ser canceladas sem reembolso.'
    }
  ] satisfies FaqItem[]
};
