import { pageSchema } from './page';
import { heroBlock } from './blocks/heroBlock';
import { worksBlock } from './blocks/worksBlock';
import { techStackBlock } from './blocks/techStackBlock';
import { labBlock } from './blocks/labBlock';
import { aboutBlock } from './blocks/aboutBlock';
import { contactBlock } from './blocks/contactBlock';
import { shaderSectionBlock } from './blocks/shaderSectionBlock';
import { footerBlock } from './blocks/footerBlock';

export const schemaTypes = [
  pageSchema,
  heroBlock,
  worksBlock,
  techStackBlock,
  labBlock,
  aboutBlock,
  contactBlock,
  shaderSectionBlock,
  footerBlock,
];
