import {
	Card as HeroCard,
	CardBody as HeroCardBody,
	CardHeader as HeroCardHeader,
	CardFooter as HeroCardFooter,
} from '@heroui/react';
import { extendVariants } from '@heroui/react';

export const Card = extendVariants(HeroCard, {});
export const CardBody = extendVariants(HeroCardBody, {});
export const CardHeader = extendVariants(HeroCardHeader, {});
export const CardFooter = extendVariants(HeroCardFooter, {});
