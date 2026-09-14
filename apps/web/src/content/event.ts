export interface AudienceItem {
  title: string;
  description: string;
}

export interface ScientificPillar {
  title: string;
  description: string;
  focus: string;
}

export interface TalkItem {
  speaker: string;
  profession: string;
  topic: string;
}

export interface ProgramPeriod {
  label: 'Manhã' | 'Tarde';
  talks: TalkItem[];
}

export interface MainProgram {
  date: string;
  title: string;
  time: string;
  venue: string;
  description: string;
  milestones: string[];
  periods: ProgramPeriod[];
}

export interface Speaker {
  name: string;
  profession: string;
  bio: string;
  topic: string;
  image: string | null;
}

export interface WorkshopHost {
  name: string;
  profession: string;
}

export interface Workshop {
  title: string;
  hosts: WorkshopHost[];
}

export interface PreEventGuest {
  name: string;
  profession: string;
  bio: string;
}

export interface PreEvent {
  dateLabel: string;
  date: string;
  title: string;
  subtitle: string;
  time: string;
  venue: string;
  intro: string[];
  notices: string[];
  workshops: Workshop[];
  guests: PreEventGuest[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface TicketCategory {
  id: string;
  name: string;
  price: string;
  priceValue: number;
  validUntil: string;
  variant: 'main' | 'combo';
  summary: string[];
  checkoutUrl: string;
  badge?: string;
  secondaryBadge?: string;
}

export const eventContent = {
  name: 'DOF Update 2026',
  edition: 'III Imersão Interprofissional em DTM e Dores Orofaciais',
  promise: 'Uma imersão interprofissional para transformar evidência científica em decisões clínicas mais seguras.',
  intro:
    'Um encontro presencial para profissionais que desejam aprofundar sua atuação em Disfunções Temporomandibulares, Dores Orofaciais, Sono e abordagens interprofissionais.',
  date: '03 de outubro de 2026',
  time: '07h30 às 18h45',
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
  even3WidgetScriptUrl:
    'https://www.even3.com.br/widget/js?e=dof-update-iii-imersao-interprofissional-em-dtm-e-dores-orofaciais-698642&t=ticket&lang=pt',
  ticketValidity: 'até 01/10/2026',
  ticketCategories: [
    {
      id: 'profissionais',
      name: 'Profissionais',
      price: 'R$ 320,00',
      priceValue: 320,
      validUntil: 'até 01/10/2026',
      variant: 'main',
      checkoutUrl:
        'https://www.even3.com.br/auxcheckout/redirect?urlEvento=dof-update-iii-imersao-interprofissional-em-dtm-e-dores-orofaciais-698642&idIngresso=820401&lang=pt',
      summary: [
        'Acesso ao evento principal',
        'Programação científica completa',
        'Experiência presencial',
        'Networking interprofissional'
      ]
    },
    {
      id: 'aluno-graduacao',
      name: 'Aluno de graduação',
      price: 'R$ 230,00',
      priceValue: 230,
      validUntil: 'até 01/10/2026',
      variant: 'main',
      checkoutUrl:
        'https://www.even3.com.br/auxcheckout/redirect?urlEvento=dof-update-iii-imersao-interprofissional-em-dtm-e-dores-orofaciais-698642&idIngresso=820404&lang=pt',
      summary: [
        'Inscrição na categoria aluno de graduação',
        'Acesso ao evento principal do dia 03/10',
        'Experiência presencial no Auditório da FAESA'
      ]
    },
    {
      id: 'profissionais-abrafito',
      name: 'Profissionais sócios adimplentes ABRAFITO',
      price: 'R$ 272,00',
      priceValue: 272,
      validUntil: 'até 01/10/2026',
      variant: 'main',
      checkoutUrl:
        'https://www.even3.com.br/auxcheckout/redirect?urlEvento=dof-update-iii-imersao-interprofissional-em-dtm-e-dores-orofaciais-698642&idIngresso=840321&lang=pt',
      summary: [
        'Condição para sócios adimplentes ABRAFITO',
        'Acesso ao evento principal',
        'Experiência presencial e networking'
      ]
    },
    {
      id: 'profissionais-combo',
      name: 'Profissionais evento + pré-evento',
      price: 'R$ 380,00',
      priceValue: 380,
      validUntil: 'até 01/10/2026',
      variant: 'combo',
      badge: 'Últimas vagas',
      secondaryBadge: 'Evento + Pré-evento',
      checkoutUrl:
        'https://www.even3.com.br/auxcheckout/redirect?urlEvento=dof-update-iii-imersao-interprofissional-em-dtm-e-dores-orofaciais-698642&idIngresso=850856&lang=pt',
      summary: [
        'Evento principal + Workshop de Tecnologias para Dor',
        'Inscrição combinada no último lote',
        'Experiência presencial em dois dias'
      ]
    },
    {
      id: 'aluno-combo',
      name: 'Alunos de graduação evento + pré-evento',
      price: 'R$ 290,00',
      priceValue: 290,
      validUntil: 'até 01/10/2026',
      variant: 'combo',
      secondaryBadge: 'Evento + Pré-evento',
      checkoutUrl:
        'https://www.even3.com.br/auxcheckout/redirect?urlEvento=dof-update-iii-imersao-interprofissional-em-dtm-e-dores-orofaciais-698642&idIngresso=850858&lang=pt',
      summary: [
        'Categoria aluno com evento + pré-evento',
        'Workshop complementar no dia 02/10',
        'Experiência presencial no Auditório da FAESA'
      ]
    },
    {
      id: 'abrafito-combo',
      name: 'Profissionais sócios adimplentes ABRAFITO evento + pré-evento',
      price: 'R$ 332,00',
      priceValue: 332,
      validUntil: 'até 01/10/2026',
      variant: 'combo',
      secondaryBadge: 'Evento + Pré-evento',
      checkoutUrl:
        'https://www.even3.com.br/auxcheckout/redirect?urlEvento=dof-update-iii-imersao-interprofissional-em-dtm-e-dores-orofaciais-698642&idIngresso=850860&lang=pt',
      summary: [
        'Condição ABRAFITO com evento + pré-evento',
        'Workshop complementar no dia 02/10',
        'Experiência presencial em dois dias'
      ]
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
  mainProgram: {
    date: '03 de outubro de 2026',
    title: 'III Imersão Interprofissional em DTM e Dores Orofaciais',
    time: '07h30 às 18h45',
    venue: 'Auditório da FAESA — Vitória/ES',
    description:
      'Um dia inteiro de atualização científica e discussão clínica com profissionais de diferentes especialidades reunidos em torno da DTM, dor orofacial, sono e cuidado interprofissional.',
    milestones: ['Credenciamento: 07h30', 'Abertura: 08h00', 'Encerramento: 18h45'],
    periods: [
      {
        label: 'Manhã',
        talks: [
          {
            speaker: 'Raí Santiago',
            profession: 'Fonoaudiólogo',
            topic:
              'Dor orofacial e DTM: o papel da fonoaudiologia na avaliação e reabilitação funcional'
          },
          {
            speaker: 'Gabriela Vendolin',
            profession: 'Cirurgiã-dentista',
            topic: 'DTM: passado, presente e futuro — da ciência à tomada de decisão clínica'
          },
          {
            speaker: 'Thays Crosara',
            profession: 'Cirurgiã-dentista',
            topic: 'Sono, DTM e dor orofacial — fundamentos para a prática clínica'
          },
          {
            speaker: 'Juliana Stuginski',
            profession: 'Cirurgiã-dentista',
            topic: 'IA na rotina clínica de DTM e Dor Orofacial'
          }
        ]
      },
      {
        label: 'Tarde',
        talks: [
          {
            speaker: 'Márcia Targino',
            profession: 'Fisioterapeuta',
            topic: 'Trismo no câncer de cabeça e pescoço'
          },
          {
            speaker: 'Roberto Garanhani',
            profession: 'Cirurgião-dentista',
            topic: 'Bruxismo, placa e DTM: como, quando e por quê?'
          },
          {
            speaker: 'Guacyra Muzzi',
            profession: 'Médica',
            topic: 'Dores orofaciais persistentes: da terapia farmacológica à intervenção'
          },
          {
            speaker: 'Thiago Motta',
            profession: 'Fisioterapeuta',
            topic: 'Influência da coluna cervical nas DTMs: onde estamos?'
          },
          {
            speaker: 'Bruna Cabugueira',
            profession: 'Fisioterapeuta',
            topic: 'Zumbido e DTM: conexões neurofuncionais e caminhos terapêuticos'
          },
          {
            speaker: 'Nídia Marinho',
            profession: 'Cirurgiã-dentista',
            topic: 'Remodelação ou degeneração? O que a tomografia nos conta sobre a ATM'
          }
        ]
      }
    ]
  } satisfies MainProgram,
  speakersIntro: [
    'O DOF Update reúne profissionais de diferentes áreas que atuam diretamente nos desafios relacionados à DTM, dor orofacial, sono, neurofisiologia e cuidado interprofissional.',
    'Diferentes especialidades, perspectivas complementares e um mesmo objetivo: transformar conhecimento científico em decisões clínicas mais seguras.'
  ],
  speakers: [
    {
      name: 'Raí Santiago',
      profession: 'Fonoaudiólogo',
      bio: 'Fonoaudiólogo pela UFES, especialista em Fonoaudiologia Neurofuncional, Disfagia e Motricidade Orofacial, certificado em Fonoaudiologia do Sono e mestre em Ciências Fisiológicas.',
      topic:
        'Dor orofacial e DTM: o papel da fonoaudiologia na avaliação e reabilitação funcional',
      image: '/speakers/rai-santiago.webp'
    },
    {
      name: 'Gabriela Vendolin',
      profession: 'Cirurgiã-dentista',
      bio: 'Especialista em DTM e Dor Orofacial pela FOB/USP, mestre e doutora em Odontologia, certificada em Odontologia do Sono e com mais de 20 anos de atuação.',
      topic: 'DTM: passado, presente e futuro — da ciência à tomada de decisão clínica',
      image: '/speakers/gabriela-vendolin.png'
    },
    {
      name: 'Thays Crosara',
      profession: 'Cirurgiã-dentista',
      bio: 'Cirurgiã-dentista, mestre em Ciências da Saúde com atuação em Medicina do Sono e doutora em Clínica Odontológica e Odontologia do Sono.',
      topic: 'Sono, DTM e dor orofacial — fundamentos para a prática clínica',
      image: '/speakers/thays-crosara.webp'
    },
    {
      name: 'Juliana Stuginski',
      profession: 'Cirurgiã-dentista',
      bio: 'Cirurgiã-dentista pela USP, mestre em Neurociências, doutora em Reabilitação Oral e especialista em DTM e Dor Orofacial.',
      topic: 'IA na rotina clínica de DTM e Dor Orofacial',
      image: '/speakers/juliana-stuginski.webp'
    },
    {
      name: 'Márcia Targino',
      profession: 'Fisioterapeuta',
      bio: 'Fisioterapeuta pela UFRJ, especialista em Fisioterapia em Cancerologia, mestre e doutora, com atuação docente na Residência Multiprofissional do INCA.',
      topic: 'Trismo no câncer de cabeça e pescoço',
      image: '/speakers/marcia-targino.webp'
    },
    {
      name: 'Roberto Garanhani',
      profession: 'Cirurgião-dentista',
      bio: 'Cirurgião-dentista, mestre em Odontologia e Implantodontia, especialista em Prótese, DTM e Dor Orofacial.',
      topic: 'Bruxismo, placa e DTM: como, quando e por quê?',
      image: '/speakers/roberto-garanhani.webp'
    },
    {
      name: 'Guacyra Muzzi',
      profession: 'Médica',
      bio: 'Médica anestesiologista e especialista no tratamento da dor, responsável pelo Ambulatório de Dor Crônica do Hospital Santa Rita de Cássia.',
      topic: 'Dores orofaciais persistentes: da terapia farmacológica à intervenção',
      image: '/speakers/guacyra-muzzi.webp'
    },
    {
      name: 'Thiago Motta',
      profession: 'Fisioterapeuta',
      bio: 'Fisioterapeuta e osteopata, especialista em Osteopatia, Dor Orofacial e DTM, coordenador da EOM Vitória e professor de pós-graduação.',
      topic: 'Influência da coluna cervical nas DTMs: onde estamos?',
      image: '/speakers/thiago-motta.webp'
    },
    {
      name: 'Bruna Cabugueira',
      profession: 'Fisioterapeuta',
      bio: 'Fisioterapeuta com atuação em zumbido, tontura, DTM e dor orofacial, com formação em agulhamento a seco, acupuntura e terapia crânio-cervicomandibular.',
      topic: 'Zumbido e DTM: conexões neurofuncionais e caminhos terapêuticos',
      image: '/speakers/bruna-cabugueira.webp'
    },
    {
      name: 'Nídia Marinho',
      profession: 'Cirurgiã-dentista',
      bio: 'Mestre em Ciências da Saúde, especialista em Cirurgia Buco-Maxilo-Facial e Implantodontia, com fellowship em Cirurgia Crânio-Maxilo-Facial e atuação em diagnóstico digital da face.',
      topic: 'Remodelação ou degeneração? O que a tomografia nos conta sobre a ATM',
      image: '/speakers/nidia-marinho.png'
    }
  ] satisfies Speaker[],
  differentiators: [
    'Ciência conectada à realidade clínica',
    'Diferentes especialidades no mesmo ambiente',
    'Espaço para troca, perguntas e conexões profissionais',
    'Experiência exclusivamente presencial',
    'Conteúdo ao vivo, sem gravação posterior'
  ],
  preEvent: {
    dateLabel: '02 OUT',
    date: '02 de outubro de 2026',
    title: 'Amplie sua experiência no DOF Update 2026',
    subtitle: 'Workshop de Tecnologias para Dor',
    time: '18h30 às 20h30',
    venue: 'Auditório da FAESA — Vitória/ES',
    intro: [
      'Na véspera do evento principal, o DOF Update abre espaço para uma experiência prática e demonstrativa dedicada a tecnologias, abordagens e temas complementares à prática clínica.',
      'Os workshops possuem vagas limitadas e inscrição específica.'
    ],
    notices: [
      'O pré-evento é uma atividade complementar ao DOF Update 2026.',
      'É necessário estar inscrito no evento principal para participar.',
      'A inscrição no evento principal não garante automaticamente uma vaga no workshop.',
      'As vagas são limitadas e a inscrição do pré-evento é específica.'
    ],
    workshops: [
      {
        title: 'Eletromiografia na percepção e conduta terapêutica do bruxismo e da dor orofacial',
        hosts: [{ name: 'Gabriela Vendolin', profession: 'Cirurgiã-dentista' }]
      },
      {
        title: 'Manejo Interprofissional do Zumbido Somatossensorial',
        hosts: [
          { name: 'Erika Galiza', profession: 'Fisioterapeuta' },
          { name: 'Sheila Paiva', profession: 'Fonoaudióloga' }
        ]
      },
      {
        title: 'Gerenciamento Estratégico do Consultório de Dor Orofacial',
        hosts: [
          { name: 'Benedito Carvalho', profession: 'Contador' },
          { name: 'Marcelo Carvalho', profession: 'Contador' }
        ]
      },
      {
        title: 'Eletroestimulação na DTM',
        hosts: [{ name: 'Benedita Barbosa', profession: 'Fisioterapeuta' }]
      }
    ],
    guests: [
      {
        name: 'Erika Galiza',
        profession: 'Fisioterapeuta',
        bio: 'Fisioterapeuta com atuação em zumbido somatossensorial, DTM, dor orofacial, cervicalgia e tontura, com abordagem baseada em raciocínio clínico e manejo interdisciplinar.'
      },
      {
        name: 'Sheila Paiva',
        profession: 'Fonoaudióloga',
        bio: 'Fonoaudióloga, professora do Departamento de Fonoaudiologia da UFES, especialista em Audiologia e com atuação em audição, equilíbrio e zumbido.'
      },
      {
        name: 'Benedito Carvalho',
        profession: 'Contador',
        bio: 'Contador, especialista em gestão para profissionais da saúde, sócio-fundador da Alphaon Gestão Financeira e com mais de 30 anos de experiência no setor.'
      },
      {
        name: 'Marcelo Carvalho',
        profession: 'Contador',
        bio: 'Contador com especialização em gestão financeira para profissionais da saúde e sócio-fundador da Alphaon Gestão Financeira.'
      }
    ]
  } satisfies PreEvent,
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
        'O evento principal acontece em 03 de outubro de 2026, das 07h30 às 18h45, no Auditório da FAESA, em Vitória/ES. O pré-evento Workshop de Tecnologias para Dor acontece em 02 de outubro, das 18h30 às 20h30.'
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
        'Não. O Workshop de Tecnologias para Dor possui inscrição específica, vagas limitadas e é atividade complementar. É necessário estar inscrito no evento principal, mas isso não garante vaga automática no pré-evento.'
    },
    {
      question: 'Como funciona a política de reembolso?',
      answer:
        'Até 30 dias antes da realização do evento, solicitações formais por e-mail podem receber devolução de 90% do valor da inscrição. Após esse período, as inscrições poderão ser canceladas sem reembolso.'
    }
  ] satisfies FaqItem[]
};
