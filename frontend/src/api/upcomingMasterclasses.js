import { apiRequest, generateJWT } from '../utils/api';

/** Program keys from {@link getProgramKeyForTargetRole} → event_group slug for v4 API */
const PROGRAM_TO_SLUG = {
  software_development: 'software-engineering',
  data_science: 'data-science',
  devops: 'devops',
  ai_ml: 'ai-machine-learning'
};

const DEFAULT_SLUG = PROGRAM_TO_SLUG.software_development;

export function getEventGroupSlugForProgram(programKey) {
  return PROGRAM_TO_SLUG[programKey] || DEFAULT_SLUG;
}

function extractEventsList(response) {
  if (!response || typeof response !== 'object') return [];
  const top = response.data;
  if (Array.isArray(top)) return top;
  if (top && typeof top === 'object' && Array.isArray(top.data)) return top.data;
  return [];
}

function formatDayAndTime(isoString) {
  const startDate = new Date(isoString);
  if (Number.isNaN(startDate.getTime())) {
    return { day: '', time: '' };
  }
  const day = startDate.toLocaleDateString('en-US', { weekday: 'short' });
  const time = startDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  return { day, time };
}

/**
 * Normalizes JSON:API-style or flat event payloads into report card fields.
 * @param {object} item — `{ id, attributes }` or a flat event object
 */
export function mapUpcomingEventToCard(item) {
  if (!item || typeof item !== 'object') return null;
  const attributes = item.attributes && typeof item.attributes === 'object'
    ? item.attributes
    : item;
  const title = attributes.title;
  if (!title) return null;

  const instructors = attributes.custom_data?.instructors;
  const firstInstructor = Array.isArray(instructors) && instructors.length > 0
    ? instructors[0]
    : null;

  const speaker =
    firstInstructor?.name ||
    attributes.instructor_name ||
    'Scaler instructor';
  const speakerTitle =
    firstInstructor?.position ||
    attributes.custom_data?.subtitle ||
    'Masterclass';

  const { day, time } = formatDayAndTime(attributes.start_time);
  const slug = attributes.slug;
  const url = slug
    ? `https://www.scaler.com/event/${slug}`
    : 'https://www.scaler.com/events/';

  return {
    title,
    speaker,
    speakerTitle,
    day: day || '—',
    time: time || '',
    url
  };
}

/**
 * @param {string} programKey — e.g. software_development
 * @param {number} [limit]
 * @returns {Promise<Array<{ title: string, speaker: string, speakerTitle: string, day: string, time: string, url: string }>>}
 */
export async function fetchUpcomingMasterclassCards(programKey, limit = 3) {
  const slug = getEventGroupSlugForProgram(programKey);
  let jwt;
  try {
    jwt = await generateJWT();
  } catch {
    jwt = null;
  }

  const response = await apiRequest(
    'GET',
    `/api/v4/event_groups/upcoming_classes/${slug}`,
    null,
    {
      params: { page_limit: limit },
      ...(jwt ? { headers: { 'X-User-Token': jwt } } : {})
    }
  );

  const events = extractEventsList(response);
  const cards = events
    .map((ev) => mapUpcomingEventToCard(ev))
    .filter(Boolean);

  return cards.slice(0, limit);
}
