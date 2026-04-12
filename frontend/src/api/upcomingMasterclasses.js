import { apiRequest } from '../utils/api';

/**
 * @typedef {object} UpcomingEventAttributes
 * @property {number} id
 * @property {string} title
 * @property {string} start_time
 * @property {string} end_time
 * @property {string} status
 * @property {string} event_type
 * @property {string} slug
 * @property {string} [instructor_name]
 * @property {number} registration_count
 * @property {object} [custom_data]
 * @property {string} [custom_data.image]
 * @property {string} [custom_data.mobile_image]
 * @property {string} [custom_data.subtitle]
 * @property {Array<{ name: string, position?: string, media_url?: string }>} [custom_data.instructors]
 */

/**
 * @typedef {object} UpcomingEventItem
 * @property {string} id
 * @property {string} type
 * @property {UpcomingEventAttributes} attributes
 */

/**
 * @typedef {object} UpcomingEventsResponse
 * @property {UpcomingEventItem[]} data
 * @property {number} [total]
 * @property {number} [current_page]
 */

/**
 * @param {number} [limit]
 * @param {string} [program] — passed as `program` query param when set
 * @returns {Promise<UpcomingEventsResponse>}
 */
export async function fetchUpcomingEvents(limit = 8, program) {
  let url = `/api/v4/events?event_type[]=company&distributor=scaler&type=upcoming&serializer_mode=L2&limit=${limit}`;
  if (program) {
    url += `&program=${encodeURIComponent(program)}`;
  }
  return apiRequest('GET', url, null, {});
}

function formatTimeRange(startDate, endDate) {
  const fmt = (d) =>
    d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  return `${fmt(startDate)} - ${fmt(endDate)}`;
}

/**
 * @param {UpcomingEventItem[]} events
 * @returns {Array<{ id: string, title: string, startDate: Date, endDate: Date, formattedTime: string, bannerUrl?: string, registeredCount?: string, ctaHref: string }>}
 */
export function formatEventData(events) {
  if (!Array.isArray(events)) return [];
  return events.map((event) => {
    const { attributes } = event;
    const startDate = new Date(attributes.start_time);
    const endDate = new Date(attributes.end_time);

    const registeredCount =
      attributes.registration_count > 0
        ? `${attributes.registration_count.toLocaleString()}+`
        : undefined;

    return {
      id: event.id,
      title: attributes.title,
      startDate,
      endDate,
      formattedTime: formatTimeRange(startDate, endDate),
      bannerUrl: attributes.custom_data?.image,
      registeredCount,
      ctaHref: `https://www.scaler.com/event/${attributes.slug}`
    };
  });
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
 * Maps JSON:API event items to TwoPaths masterclass card fields.
 * @param {UpcomingEventItem | object} item
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
 * @param {string} programKey — e.g. from {@link getProgramKeyForTargetRole}
 * @param {number} [limit]
 */
export async function fetchUpcomingMasterclassCards(programKey, limit = 3) {
  const response = await fetchUpcomingEvents(limit, programKey);
  const events = Array.isArray(response?.data) ? response.data : [];
  return events
    .map((ev) => mapUpcomingEventToCard(ev))
    .filter(Boolean)
    .slice(0, limit);
}
