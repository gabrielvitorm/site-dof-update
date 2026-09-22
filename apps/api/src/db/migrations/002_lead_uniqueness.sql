create unique index if not exists idx_leads_email_normalized_unique on leads(email_normalized);

create unique index if not exists idx_leads_phone_e164_unique
  on leads(phone_e164)
  where phone_e164 is not null;
