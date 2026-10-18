const repositoryList = document.querySelector("#repository-list");
const loadingMessage = document.querySelector("#loading-message");

function createRepositoryItem(event) {
  const repositoryName = event.repo.name;
  const item = document.createElement("li");
  const link = document.createElement("a");
  const date = document.createElement("time");
  const starredAt = new Date(event.created_at);

  item.className = "repository-item";

  link.className = "repository-link";
  link.href = `https://github.com/${repositoryName}`;
  link.textContent = repositoryName;
  link.target = "_blank";
  link.rel = "noopener noreferrer";

  date.className = "repository-date";
  date.dateTime = event.created_at;
  date.textContent = `Starred ${new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
  }).format(starredAt)}`;

  item.append(link, date);
  return item;
}

async function renderRepositories() {
  try {
    const response = await fetch("events.json");
    if (!response.ok) {
      throw new Error(`Unable to load repositories (${response.status})`);
    }

    const events = await response.json();
    if (!Array.isArray(events)) {
      throw new Error("Repository data must be a list");
    }

    const watchEvents = events.filter(
      (event) =>
        event.type === "WatchEvent" &&
        typeof event.repo?.name === "string" &&
        typeof event.created_at === "string" &&
        !Number.isNaN(Date.parse(event.created_at)),
    );

    if (watchEvents.length === 0) {
      loadingMessage.textContent = "No starred repositories to show yet.";
      return;
    }

    repositoryList.replaceChildren(...watchEvents.map(createRepositoryItem));
    loadingMessage.textContent = "";
  } catch (error) {
    console.error("Could not render starred repositories:", error);
    loadingMessage.textContent =
      "Repositories could not be loaded. Please try again later.";
  }
}

renderRepositories();
