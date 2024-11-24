<!-- CollectionTree.svelte -->
<script>
    import { createEventDispatcher } from "svelte";
    export let collections = [];
    export let fullCollections = collections; // Default to collections if not provided

    export let name = "All Items";
    export let expanded = true;
    export let depth = 0;
    export let parentCollection = null;
    export let selectedCollection;
    export let showCount = true;

    export let collectionsWithChild = [];

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

        // console.log(collection.children);

        // if (collection.children) {
        //     total += collection.children.reduce(
        //         (sum, child) => sum + getTotalItems(child),
        //         0,
        //     );
        // }
        return total;
    }

    const folderSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>`;

    const currentCollection = parentCollection
        ? { ...parentCollection, children: collections }
        : { name, children: collections, meta: { numItems: 0 } };

    // The collections that should have the bottom border are a subset of collections with children
    // Given all subcollections returned from below that share a parent, check their indices. One that has an index that follows the other one will be on the bottom
    function collectionBelowThisCollection() {
        // console.log("hi", depth, collections);

        function collectionHasChild(c2) {
            if (c2.children && c2.children.length > 0) {
                return true;
            } else {
                return false;
            }
        }

        for (let collection of collections) {
            console.log(collection);

            // COLLECTION WITH CHILD FOUND
            if (collectionHasChild(collection)) {
                // console.log(collection);

                for (let i = 0; i < collections.length; i++) {
                    let collection2 = collections[i];

                    // only first level I think
                    let found = false;

                    // console.log(collection, collection2);
                    if (collection2.name === collection.name) {
                        let found = true;

                        if (i + 1 > collections.length) {
                            return true;
                        } else if (collectionHasChild(collections[i + 1])) {
                            return true;
                        }
                    }
                    // console.log(collection2);
                }
                // console.log(
                //     depth,
                //     collection,
                //     collections,
                //     parentCollection,
                //     fullCollections,
                // );
            }
        }

        return false;
    }
</script>

<div
    class="
    relative bg-white border-black text-sm
     {depth > 0 ? 'border-l  border-t border-b' : 'border'}
     "
>
    <button
        class="text-blue-600 hover:underline w-full text-left hover:bg-gray-100 truncate cursor-pointer border-none m-0 flex items-center justify-between"
        class:bg-gray-200={selectedCollection
            ? selectedCollection.key === currentCollection.key
            : currentCollection.name === "All Items"}
        on:click={() => handleClick(currentCollection)}
        on:click={() => new Audio("blip1.mp4").play()}
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
            <!-- {console.log("HEYO", depth, parentCollection)} -->
        </div>
        {#if showCount}
            <span class="text-gray-500 text-sm mr-0.5"
                >({getTotalItems(currentCollection)})</span
            >
        {/if}
    </button>
    {#if expanded}
        <ul class="pl-2 ml-2 list-none border-l border-gray-400">
            {#each collections as collection}
                <li>
                    {#if collection.children && collection.children.length > 0}
                        <svelte:self
                            {selectedCollection}
                            name={collection.name}
                            collections={collection.children}
                            {fullCollections}
                            {collectionsWithChild}
                            depth={depth + 1}
                            parentCollection={collection}
                            {showCount}
                            on:collectionClick
                        />
                    {:else}
                        <button
                            on:click={() => new Audio("blip1.mp4").play()}
                            class="text-blue-600 pl-px hover:underline w-full text-left hover:bg-gray-100 flex items-center justify-between"
                            class:bg-gray-200={selectedCollection &&
                                selectedCollection.name === collection.name}
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
