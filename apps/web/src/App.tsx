import { eventContent } from './content/event';
import './styles.css';

export function App() {
  return (
    <main className="landing">
      <HeroSection />
      <section className="section section-light" id="why-participate">
        <SectionIntro
          eyebrow="Por que participar"
          title="Atualizacao cientifica que se conecta a pratica clinica"
          copy={eventContent.whyParticipate}
        />
        <div className="feature-grid">
          {eventContent.pillars.map((pillar) => (
            <article className="feature-card" key={pillar.title}>
              <span>{pillar.title}</span>
              <p>{pillar.description}</p>
              <small>{pillar.focus}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="section section-muted" id="audience">
        <SectionIntro
          eyebrow="Publico"
          title="Para quem e o DOF Update 2026?"
          copy="Uma imersao criada para profissionais e estudantes da saude que querem aprofundar DTM, dor orofacial, sono e cuidado interprofissional."
        />
        <div className="audience-grid">
          {eventContent.audience.map((item) => (
            <article className="audience-item" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <ProgramSection />
      <SpeakersSection />
      <ExperienceSection />
      <OfferSection />
      <LocationSection />
      <FaqSection />
      <FinalCtaSection />
    </main>
  );
}

function HeroSection() {
  return (
    <section className="hero" id="hero">
      <div className="hero-content">
        <p className="eyebrow">{eventContent.lot}</p>
        <h1>{eventContent.name}</h1>
        <p className="hero-edition">{eventContent.edition}</p>
        <p className="hero-promise">{eventContent.promise}</p>
        <p className="hero-copy">{eventContent.intro}</p>
        <div className="hero-facts" aria-label="Informacoes principais do evento">
          <span>{eventContent.date}</span>
          <span>{eventContent.venue}</span>
          <span>{eventContent.city}</span>
          <span>{eventContent.price}</span>
        </div>
        <div className="hero-actions">
          <a className="button button-primary" href="#offer">
            {eventContent.primaryCta}
          </a>
          <span>{eventContent.format}. {eventContent.noRecording}</span>
        </div>
      </div>
      <div className="hero-visual" aria-hidden="true">
        <div className="target target-large" />
        <div className="target target-small" />
        <div className="visual-panel">
          <span>DTM</span>
          <span>Dor Orofacial</span>
          <span>Sono</span>
          <span>Interprofissional</span>
        </div>
      </div>
    </section>
  );
}

function ProgramSection() {
  return (
    <section className="section section-dark" id="program">
      <SectionIntro
        eyebrow="Programacao"
        title="Programacao DOF Update 2026"
        copy="Dois dias de conteudo, pratica e integracao entre profissionais de diferentes areas da saude."
      />
      <div className="program-grid">
        {eventContent.program.map((program) => (
          <article className="program-block" key={program.date}>
            <p className="eyebrow">{program.date}</p>
            <h3>{program.title}</h3>
            <strong>{program.time}</strong>
            <p>{program.description}</p>
            <ul>
              {program.agenda.map((agendaItem) => (
                <li key={agendaItem}>{agendaItem}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

function SpeakersSection() {
  return (
    <section className="section section-light" id="speakers">
      <SectionIntro
        eyebrow="Palestrantes"
        title="Quem estara no DOF Update 2026"
        copy="Os nomes e credenciais definitivos devem ser inseridos apenas quando forem fornecidos pela organizacao."
      />
      <div className="speaker-grid">
        {eventContent.speakers.map((speaker) => (
          <article className="speaker-card" key={speaker.name}>
            <div className="speaker-avatar" aria-hidden="true" />
            <h3>{speaker.name}</h3>
            <p>{speaker.specialty}</p>
            <small>{speaker.topic}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

function ExperienceSection() {
  return (
    <section className="section section-muted" id="experience">
      <SectionIntro
        eyebrow="Experiencia"
        title="Mais do que assistir palestras. Uma experiencia para ampliar sua pratica clinica."
        copy="O DOF Update foi pensado para profissionais que nao querem apenas acumular informacao, mas compreender melhor os casos que chegam ao consultorio."
      />
      <div className="line-list">
        {eventContent.differentiators.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </div>
      <aside className="workshop-callout">
        <p className="eyebrow">Workshop</p>
        <h3>Workshop de Tecnologias para Dor</h3>
        <p>{eventContent.workshopNotice}</p>
      </aside>
    </section>
  );
}

function OfferSection() {
  return (
    <section className="section offer-section" id="offer">
      <div>
        <p className="eyebrow">{eventContent.lot}</p>
        <h2>Garanta sua vaga no DOF Update 2026</h2>
        <p>
          {eventContent.edition}. Um dia inteiro de atualizacao cientifica, integracao entre especialidades e
          discussoes voltadas para a pratica clinica.
        </p>
        <a className="button button-primary" href="#hero">
          Garantir minha vaga no ultimo lote
        </a>
      </div>
      <div className="price-box">
        <span>{eventContent.date}</span>
        <strong>{eventContent.price}</strong>
        <p>{eventContent.format}</p>
      </div>
      <div className="group-box">
        <h3>{eventContent.groupOffer.title}</h3>
        {eventContent.groupOffer.items.map((item) => (
          <p key={item}>{item}</p>
        ))}
        <a href="#location">{eventContent.groupOffer.cta}</a>
      </div>
    </section>
  );
}

function LocationSection() {
  return (
    <section className="section section-light" id="location">
      <SectionIntro
        eyebrow="Localizacao"
        title={eventContent.location.title}
        copy={`${eventContent.venue} - ${eventContent.city}. ${eventContent.location.guidance}`}
      />
      <div className="location-panel">
        <div className="map-placeholder" aria-label="Mapa sera carregado de forma lazy">
          <span>FAESA</span>
          <small>{eventContent.location.address}</small>
        </div>
        <a className="button button-secondary" href="#hero">
          Abrir localizacao no Google Maps
        </a>
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section className="section section-muted" id="faq">
      <SectionIntro eyebrow="FAQ" title="Perguntas frequentes" copy="Respostas para as principais duvidas antes da inscricao." />
      <div className="faq-list">
        {eventContent.faqs.map((faq) => (
          <details key={faq.question} open>
            <summary>{faq.question}</summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function FinalCtaSection() {
  return (
    <section className="final-cta" id="final">
      <p className="eyebrow">Proxima atualizacao clinica</p>
      <h2>Sua proxima atualizacao clinica pode comecar aqui.</h2>
      <p>
        {eventContent.name} - Ciencia, pratica clinica e diferentes especialidades reunidas em torno do mesmo
        paciente.
      </p>
      <a className="button button-primary" href="#offer">
        Garantir minha vaga no DOF Update 2026
      </a>
    </section>
  );
}

function SectionIntro({
  eyebrow,
  title,
  copy
}: {
  eyebrow: string;
  title: string;
  copy: string;
}) {
  return (
    <div className="section-intro">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p>{copy}</p>
    </div>
  );
}
