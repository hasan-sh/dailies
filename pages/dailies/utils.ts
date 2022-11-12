import DOMPurify from 'dompurify';
import parse, { domToReact } from 'html-react-parser';

export const parseHTML = (htmlString: string) : ReturnType<typeof domToReact> => {
  const cleanHtmlString = DOMPurify.sanitize(htmlString,
    { USE_PROFILES: { html: true } });
  const html = parse(cleanHtmlString);
  return html;
}