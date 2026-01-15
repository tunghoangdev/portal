import {
	Listbox as HeroListbox,
	ListboxItem as HeroListboxItem,
} from '@heroui/react';
import { extendVariants, Input as BaseInput } from '@heroui/react';

export const Listbox = extendVariants(HeroListbox, {});
export const ListboxItem = extendVariants(HeroListboxItem, {});
