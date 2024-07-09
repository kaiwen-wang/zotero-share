<script>
    import { onMount } from "svelte";
    import api from "zotero-api-client";
    import CollectionTree from "$lib/CollectionTree.svelte";
    import ItemCard from "$lib/ItemCard.svelte";
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";

    import Header from "$lib/Header.svelte";
    import CollectionTree2 from "$lib/CollectionTree2.svelte";

    let viewMode = "grid"; // New state for view mode

    let sortFlashText = "";
    let sortFlashTimeout;

    function toggleViewMode() {
        viewMode = viewMode === "grid" ? "list" : "grid";
    }

    function flashSortText(text) {
        sortFlashText = text;
        if (sortFlashTimeout) clearTimeout(sortFlashTimeout);
        sortFlashTimeout = setTimeout(() => {
            sortFlashText = "";
        }, 1500);
    }

    export let data;

    let isLoading = false,
        hasMore = true,
        start = 0,
        loadingNewCategory = false;
    let showCount = true,
        items = [],
        collections = [],
        loadingCollections = true,
        loadingItems = true;
    let selectedCollection = null,
        sortMethod = "dateAdded",
        sortDirection = "desc";
    // let bottomObserver, bottomMarker;

    const toggleCount = () => (showCount = !showCount);

    onMount(async () => {
        try {
            const [itemsResponse, collectionsResponse] = await Promise.all([
                api().library("group", data.param).items().top().get({
                    sort: sortMethod,
                    direction: sortDirection,
                    limit: 100,
                    start: 0,
                }),
                api()
                    .library("group", data.param)
                    .collections()
                    .get({ limit: 100 }),
            ]);

            // hasMore = !!itemsResponse.getRelLinks().next;
            // start = 24;
            items = itemsResponse.getData();
            console.log(items);
            collections = organizeCollections(
                collectionsResponse.getData(),
                collectionsResponse.getMeta(),
            );
            parseUrlAndSelectCollection();
        } catch (error) {
            console.error("Error fetching Zotero data:", error);
        } finally {
            loadingCollections = loadingItems = false;
        }

        // bottomObserver = new IntersectionObserver(
        //     (entries) => {
        //         if (entries[0].isIntersecting) loadMoreItems();
        //     },
        //     { rootMargin: "100px" },
        // );
        // if (bottomMarker) bottomObserver.observe(bottomMarker);
    });

    // async function loadMoreItems() {
    //     if (isLoading || !hasMore || loadingNewCategory) return;
    //     isLoading = true;
    //     try {
    //         let query = api().library("group", data.param);
    //         if (selectedCollection && selectedCollection.name !== "All Items") {
    //             query = query.collections(selectedCollection.key);
    //         }
    //         const itemsResponse = await query.items().top().get({
    //             sort: sortMethod,
    //             direction: sortDirection,
    //             limit: 24,
    //             start,
    //         });
    //         items = [...items, ...itemsResponse.getData()];
    //         hasMore = !!itemsResponse.getRelLinks().next;
    //         start += 24;
    //     } catch (error) {
    //         console.error("Error fetching more items:", error);
    //     } finally {
    //         isLoading = false;
    //     }
    // }

    async function handleCollectionClick(event) {
        const collection = event.detail;
        selectedCollection = collection;
        loadingItems = loadingNewCategory = true;
        // start = 0;
        // hasMore = true;

        const collectionParam =
            collection.name === "All Items"
                ? ""
                : `?collection=${encodeCollectionName(collection.name)}`;
        goto(`${$page.url.pathname}${collectionParam}`, { replaceState: true });

        try {
            const query =
                selectedCollection.name === "All Items"
                    ? api().library("group", data.param).items().top()
                    : api()
                          .library("group", data.param)
                          .collections(collection.key)
                          .items()
                          .top();

            const itemsResponse = await query.get({
                sort: sortMethod,
                limit: 100,
                direction: sortDirection,
                limit: 24,
            });
            items = itemsResponse.getData();
        } catch (error) {
            console.error("Error fetching collection items:", error);
        } finally {
            loadingItems = loadingNewCategory = false;
        }
    }

    function parseUrlAndSelectCollection() {
        const encodedCollectionName = new URLSearchParams($page.url.search).get(
            "collection",
        );
        if (encodedCollectionName) {
            const collectionName = decodeCollectionName(encodedCollectionName);
            const foundCollection = findCollectionByName(
                collections,
                collectionName,
            );
            if (foundCollection) {
                selectedCollection = foundCollection;
                handleCollectionClick({ detail: foundCollection });
            }
        }
    }

    function findCollectionByName(collections, name) {
        for (let collection of collections) {
            if (collection.name === name) return collection;
            if (collection.children) {
                const found = findCollectionByName(collection.children, name);
                if (found) return found;
            }
        }
        return null;
    }

    function organizeCollections(flatCollections, metaArray) {
        const collectionsMap = new Map();
        const rootCollections = [];

        flatCollections.forEach((collection, index) => {
            collectionsMap.set(collection.key, {
                ...collection,
                meta: metaArray[index],
                children: [],
            });
        });

        flatCollections.forEach((collection) => {
            const collectionWithChildren = collectionsMap.get(collection.key);
            if (
                collection.parentCollection &&
                collection.parentCollection !== false
            ) {
                const parent = collectionsMap.get(collection.parentCollection);
                parent
                    ? parent.children.push(collectionWithChildren)
                    : rootCollections.push(collectionWithChildren);
            } else {
                rootCollections.push(collectionWithChildren);
            }
        });

        return rootCollections;
    }

    async function handleSort(method) {
        start = 0;
        hasMore = true;
        loadingNewCategory = true;
        sortDirection =
            method === sortMethod
                ? sortDirection === "desc"
                    ? "asc"
                    : "desc"
                : "desc";
        sortMethod = method;

        if (method === "dateAdded") {
            flashSortText(
                sortDirection === "desc" ? "New to Old" : "Old to New",
            );
        } else if (method === "title") {
            flashSortText(sortDirection === "desc" ? "Z to A" : "A to Z");
        }

        loadingItems = true;
        try {
            let query = api().library("group", data.param);
            if (selectedCollection && selectedCollection.key)
                query = query.collections(selectedCollection.key);
            const itemsResponse = await query.items().top().get({
                sort: sortMethod,
                limit: 100,
                direction: sortDirection,
                limit: 24,
            });
            items = itemsResponse.getData();
        } catch (error) {
            console.error("Error fetching sorted items:", error);
        } finally {
            loadingItems = loadingNewCategory = false;
        }
    }

    function findNextCollection(collections, currentCollection, direction) {
        const flattenCollections = (cols) => {
            return cols.reduce((acc, col) => {
                acc.push(col);
                if (col.children) {
                    acc.push(...flattenCollections(col.children));
                }
                return acc;
            }, []);
        };

        const allCollections = [
            { name: "All Items" },
            ...flattenCollections(collections),
        ];
        const currentIndex = allCollections.findIndex(
            (c) => c.name === currentCollection.name,
        );

        if (currentIndex === -1) return null;

        const nextIndex =
            direction === "next"
                ? (currentIndex + 1) % allCollections.length
                : (currentIndex - 1 + allCollections.length) %
                  allCollections.length;

        return allCollections[nextIndex];
    }

    function onKeyDown(event) {
        // Ignore if input or textarea is focused, or if any modifier key is pressed
        if (
            event.target.tagName === "INPUT" ||
            event.target.tagName === "TEXTAREA" ||
            event.metaKey ||
            event.ctrlKey ||
            event.altKey
        ) {
            return;
        }

        const key = event.key.toLowerCase();
        if (key === "d" || key === "t") {
            event.preventDefault();
            const button = document.getElementById(
                key === "d" ? "sortByDate" : "sortByTitle",
            );
            if (button) button.click();
        } else if (key === "c") {
            event.preventDefault();
            toggleCount();
        } else if (key === "g" || key === "r") {
            event.preventDefault();
            if (
                (key === "g" && viewMode !== "grid") ||
                (key === "r" && viewMode !== "list")
            ) {
                toggleViewMode();
            }
        } else if (key === "arrowleft" || key === "arrowright") {
            event.preventDefault();
            const direction = key === "arrowright" ? "next" : "previous";
            const nextCollection = findNextCollection(
                collections,
                selectedCollection || { name: "All Items" },
                direction,
            );
            if (nextCollection) {
                selectedCollection = nextCollection;
                handleCollectionClick({ detail: nextCollection });
            }
        }
    }

    const encodeCollectionName = encodeURIComponent;
    const decodeCollectionName = decodeURIComponent;

    $: if ($page) parseUrlAndSelectCollection();
</script>

<svelte:head>
    <title>Zotero Reading List</title>
    <meta
        name="description"
        content="Display of Zotero group items and collections"
    />
</svelte:head>

<body class="relative">
    <div
        class="-z-10 fixed top-0 left-0 right-0 bottom-0"
        style="opacity: 0.6; background: linear-gradient(to bottom, #FFECB3, transparent);"
    ></div>

    <Header />
    <div class="container mx-auto py-8">
        <div class="flex flex-col md:flex-row relative">
            <!-- Collections (left side) -->
            <div
                class=" sticky top-0 w-full md:w-1/4 pr-4 mb-4 md:mb-0 mr-8 h-fit"
            >
                <div
                    class=" border-b border-gray-700 relative pb-2 mb-8 min-h-12 flex items-end justify-between"
                >
                    <div class="text-2xl font-medium h-fit leading-none">
                        Collections
                    </div>

                    <div
                        class="text-sm leading-none flex items-center gap-2 h-fit"
                    >
                        <div>
                            <span class="underline">C</span>ount:
                        </div>
                        <label
                            class="relative inline-flex items-center cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                checked={showCount}
                                on:change={toggleCount}
                                class="sr-only peer"
                            />
                            <div
                                class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
                            ></div>
                        </label>
                    </div>
                </div>
                {#if loadingCollections}
                    {#each Array(5) as _}
                        <div
                            class="h-8 bg-gray-200 rounded mb-2 animate-pulse"
                        ></div>
                    {/each}
                {:else}
                    <CollectionTree
                        {selectedCollection}
                        {collections}
                        {showCount}
                        on:collectionClick={handleCollectionClick}
                    />

                    <!-- WIP WITH RECURIVE TABLE TREE TO COLLAPSE BORDERS -->
                    <!-- <table class="mt-2 w-full border-collapse bg-white">
                        <CollectionTree2
                            {selectedCollection}
                            {collections}
                            {showCount}
                            on:collectionClick={handleCollectionClick}
                        />
                    </table> -->
                    <div class="flex gap-2 mt-4 justify-end">
                        <div
                            class="p-2 w-full bg-gray-50 border border-black flex place-content-center"
                        >
                            <svg
                                width="32"
                                height="32"
                                viewBox="0 0 15 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                ><path
                                    d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94628 8.84182 3.13514Z"
                                    fill="currentColor"
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                ></path></svg
                            >
                        </div>
                        <div
                            class="p-2 w-full bg-gray-50 border border-black flex place-content-center"
                        >
                            <svg
                                width="32"
                                height="32"
                                viewBox="0 0 15 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                ><path
                                    d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z"
                                    fill="currentColor"
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                ></path></svg
                            >
                        </div>
                    </div>
                {/if}
            </div>

            <!-- Items (right side) -->
            <div class="w-full md:w-3/4">
                <div
                    class=" border-b border-gray-700 sticky top-0 z-20 bg-[rgb(255,244,212)] pb-2 mb-8 flex justify-between items-end min-h-12"
                >
                    <div class="text-2xl font-medium leading-none">
                        {selectedCollection
                            ? selectedCollection.name
                            : "All Items"}
                    </div>

                    <div class="flex gap-2">
                        <div class="flex items-center gap-2 text-sm">
                            {#if sortFlashText}
                                <div class="text-blue-600 font-bold">
                                    {sortFlashText}
                                </div>
                            {:else}
                                Sort:
                            {/if}
                            <div
                                class="font-mono flex text-sm border shadow-inner bg-gray-50 border-black"
                            >
                                <button
                                    id="sortByDate"
                                    class="hover:bg-gray-200 cursor-pointer px-4 py-0.5 border-r border-black"
                                    class:bg-gray-200={sortMethod ===
                                        "dateAdded"}
                                    on:click={() => handleSort("dateAdded")}
                                >
                                    <span class="underline">D</span>ate {sortMethod ===
                                    "dateAdded"
                                        ? sortDirection === "desc"
                                            ? "←"
                                            : "→"
                                        : "-"}
                                </button>
                                <button
                                    id="sortByTitle"
                                    class="hover:bg-gray-200 cursor-pointer px-4 py-0.5"
                                    class:bg-gray-200={sortMethod === "title"}
                                    on:click={() => handleSort("title")}
                                >
                                    <span class="underline">T</span>itle {sortMethod ===
                                    "title"
                                        ? sortDirection === "desc"
                                            ? "←"
                                            : "→"
                                        : "-"}
                                </button>
                            </div>
                        </div>

                        <div class="flex items-center gap-2 text-sm">
                            <div
                                class="font-mono flex text-sm border shadow-inner bg-gray-50 border-black"
                            >
                                <button
                                    id="listView"
                                    class="hover:bg-gray-200 cursor-pointer px-4 flex items-center justify-center gap-2"
                                    class:bg-gray-200={viewMode === "list"}
                                    on:click={toggleViewMode}
                                >
                                    <div>
                                        <span class="underline">R</span>ows
                                    </div>
                                    <svg
                                        width="15"
                                        height="15"
                                        viewBox="0 0 15 15"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M14 11.85L1 11.85L1 13.15L14 13.15L14 11.85ZM14 6.85L1 6.85L1 8.15L14 8.15L14 6.85ZM1 1.85L14 1.85L14 3.15L1 3.15L1 1.85Z"
                                            fill="currentColor"
                                            fill-rule="evenodd"
                                            clip-rule="evenodd"
                                        />
                                    </svg>
                                </button>
                                <button
                                    id="gridView"
                                    class="hover:bg-gray-200 cursor-pointer flex items-center justify-center gap-2 px-4 py-0.5 border-l border-black"
                                    class:bg-gray-200={viewMode === "grid"}
                                    on:click={toggleViewMode}
                                >
                                    <div>
                                        <span class="underline">G</span>rid
                                    </div>
                                    <svg
                                        width="15"
                                        height="15"
                                        viewBox="0 0 15 15"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M12.5 2H8V7H13V2.5C13 2.22386 12.7761 2 12.5 2ZM13 8H8V13H12.5C12.7761 13 13 12.7761 13 12.5V8ZM7 7V2H2.5C2.22386 2 2 2.22386 2 2.5V7H7ZM2 8V12.5C2 12.7761 2.22386 13 2.5 13H7V8H2ZM2.5 1C1.67157 1 1 1.67157 1 2.5V12.5C1 13.3284 1.67157 14 2.5 14H12.5C13.3284 14 14 13.3284 14 12.5V2.5C14 1.67157 13.3284 1 12.5 1H2.5Z"
                                            fill="currentColor"
                                            fill-rule="evenodd"
                                            clip-rule="evenodd"
                                        ></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    class={viewMode === "grid"
                        ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                        : ""}
                >
                    {#if loadingItems}
                        {#each Array(8) as _}
                            <ItemCard loading={true} item={{}} {viewMode} />
                        {/each}
                    {:else}
                        {#each items as item}
                            <ItemCard {item} {viewMode} />
                        {/each}
                    {/if}
                </div>

                <!-- Comment out the pagination-related elements -->
                <!-- {#if isLoading}
        <div class="mt-4 text-center">Loading more items...</div>
    {/if}
    {#if hasMore}
        <div bind:this={bottomMarker} class="h-1"></div>
    {/if} -->
            </div>
        </div>
    </div>
</body>
<svelte:window on:keydown={onKeyDown} />
