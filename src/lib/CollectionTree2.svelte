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

    function getIndentation(depth) {
        return `ml-${depth * 7}`;
    }
</script>

<tr class="">
    <td class="border border-black p-0" style="width: 28px; height: 28px;">
        <button
            class="w-full h-full flex items-center justify-center cursor-pointer"
            on:click|stopPropagation={toggle}
        >
            {@html folderSvg}
        </button>
    </td>
    <td class="border border-black p-0">
        <button
            class="text-blue-600 hover:underline w-full text-left hover:bg-gray-100 cursor-pointer border-none m-0 flex items-center justify-between p-1"
            class:bg-gray-200={selectedCollection &&
                selectedCollection.name === currentCollection.name}
            on:click={() => handleClick(currentCollection)}
            data-collection-key={currentCollection.key}
        >
            <div class="flex items-center w-full">
                {currentCollection.name}
            </div>
            {#if showCount}
                <span class="text-gray-500 text-sm mr-0.5">({totalItems})</span>
            {/if}
        </button>
    </td>
</tr>
{#if expanded}
    {#each collections as collection}
        <tr>
            <td
                class={`border border-black p-0 
                    bg-gray-${100}
                    `}
            >
            </td>
            <td class="border border-black p-0">
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
                    <tr>
                        <td
                            class="border p-0 bg-gray-100"
                            style="width: 28px; height: 28px;"
                        >
                        </td>

                        <button
                            class="text-blue-600 py-1 hover:underline w-full text-left hover:bg-gray-100 flex items-center justify-between p-1"
                            class:bg-gray-200={selectedCollection &&
                                selectedCollection.name === collection.name}
                            on:click={() => handleClick(collection)}
                            data-collection-key={collection.key}
                        >
                            <div class="flex items-center">
                                {collection.name}
                            </div>
                            {#if showCount}
                                <span class="text-gray-500 text-sm mr-0.5">
                                    ({getTotalItems(collection)})
                                </span>
                            {/if}
                        </button>
                    </tr>
                {/if}
            </td>
        </tr>
    {/each}
{/if}
