<!-- CollectionTree.svelte -->
<script>
    import { createEventDispatcher } from "svelte";
    export let collections = [];
    export let name = "All Items";
    export let expanded = true;
    export let depth = 0;
    export let parentCollection = null;
    export let selectedCollection;
    export let showCount = true;

    const dispatch = createEventDispatcher();

    function toggle(event) {
        event.stopPropagation();
        expanded = !expanded;
    }

    function handleClick(collection) {
        dispatch("collectionClick", collection);
    }

    function getTotalItems(collection) {
        let total = collection.meta.numItems;
        if (collection.children) {
            total += collection.children.reduce(
                (sum, child) => sum + getTotalItems(child),
                0,
            );
        }
        return total;
    }

    const folderSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>`;

    const currentCollection = parentCollection
        ? { ...parentCollection, children: collections }
        : { name, children: collections, meta: { numItems: 0 } };

    const totalItems = getTotalItems(currentCollection);

    function isLastItem(collection, parentCollections) {
        return (
            parentCollections.indexOf(collection) ===
            parentCollections.length - 1
        );
    }
</script>

<div
    class="relative bg-white border border-black {depth > 0
        ? '-mt-px -mr-px'
        : ''}"
>
    <button
        class="text-blue-600 hover:underline w-full text-left hover:bg-gray-100 cursor-pointer border-none m-0 flex items-center justify-between"
        class:bg-gray-200={selectedCollection
            ? selectedCollection.key === currentCollection.key
            : currentCollection.name === "All Items"}
        on:click={() => handleClick(currentCollection)}
        data-collection-key={currentCollection.key}
    >
        <div class="flex items-center">
            <button
                class="mr-2 cursor-pointer transition-transform duration-200 ease-in-out"
                class:rotate-90={expanded}
                on:click|stopPropagation={toggle}
            >
                {@html folderSvg}
            </button>
            {currentCollection.name}
        </div>
        {#if showCount}
            <span class="text-gray-500 text-sm mr-0.5">({totalItems})</span>
        {/if}
    </button>
    {#if expanded}
        <ul class="pl-2 ml-2 list-none border-l border-gray-400">
            {#each collections as collection}
                <li class={isLastItem(collection, collections) ? "-mb-px" : ""}>
                    {#if collection.children && collection.children.length > 0}
                        <svelte:self
                            {selectedCollection}
                            name={collection.name}
                            collections={collection.children}
                            depth={depth + 1}
                            parentCollection={collection}
                            {showCount}
                            on:collectionClick
                        />
                    {:else}
                        <button
                            class="text-blue-600 hover:underline w-full text-left hover:bg-gray-100 flex items-center justify-between"
                            class:bg-gray-200={selectedCollection &&
                                selectedCollection.name === collection.name}
                            style="padding-left: {depth * 1}rem;"
                            on:click={() => handleClick(collection)}
                            data-collection-key={collection.key}
                        >
                            <div class="flex items-center">
                                <span class="w-5 h-5 mr-2"></span>
                                {collection.name}
                            </div>
                            {#if showCount}
                                <span class="text-gray-500 text-sm mr-0.5"
                                    >({getTotalItems(collection)})</span
                                >
                            {/if}
                        </button>
                    {/if}
                </li>
            {/each}
        </ul>
    {/if}
</div>
