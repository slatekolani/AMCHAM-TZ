import { Page, PageBlockDataMap, PageBlockType } from '@/types';

export function getBlock<T extends PageBlockType>(
    page: Page | null | undefined,
    type: T,
): PageBlockDataMap[T] | undefined {
    const block = page?.content?.blocks?.find((item) => item.type === type);
    return block ? (block.data as PageBlockDataMap[T]) : undefined;
}

export function getBlocks<T extends PageBlockType>(
    page: Page | null | undefined,
    type: T,
): PageBlockDataMap[T][] {
    return (page?.content?.blocks ?? [])
        .filter((item) => item.type === type)
        .map((item) => item.data as PageBlockDataMap[T]);
}
