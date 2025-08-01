# PublicationsContext

A global React Context for managing publications state across the application. This context provides a centralized way to fetch, manage, and access publications data without re-fetching from the database multiple times.

## Features

- **Global State Management**: Publications are fetched once and shared across all components
- **Real-time Updates**: State updates automatically when publications are modified
- **Error Handling**: Built-in error handling for failed requests
- **Loading States**: Loading indicators for async operations
- **CRUD Operations**: Create, read, update, and delete publications
- **User-specific Data**: Automatically fetches publications for the current user

## Usage

### Basic Usage

```tsx
import { usePublications } from '@/components';

function MyComponent() {
  const { publications, loading, error } = usePublications();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {publications.map(pub => (
        <div key={pub.id}>{pub.title}</div>
      ))}
    </div>
  );
}
```

### Available Methods

#### `publications`
Array of current user's publications.

#### `loading`
Boolean indicating if publications are being fetched.

#### `error`
String containing error message if fetch failed.

#### `refreshPublications()`
Manually refresh publications from the database.

```tsx
const { refreshPublications } = usePublications();

const handleRefresh = async () => {
  await refreshPublications();
};
```

#### `addPublication(publication)`
Add a new publication to the state.

```tsx
const { addPublication } = usePublications();

const newPublication = {
  id: 'new-id',
  title: 'New Publication',
  description: 'Description',
  pdf_url: 'https://example.com/file.pdf',
  thumb_url: null,
  created_at: new Date().toISOString(),
  user_id: 'user-id'
};

addPublication(newPublication);
```

#### `updatePublication(id, updates)`
Update an existing publication.

```tsx
const { updatePublication } = usePublications();

updatePublication('publication-id', {
  title: 'Updated Title',
  description: 'Updated description'
});
```

#### `deletePublication(id)`
Remove a publication from the state.

```tsx
const { deletePublication } = usePublications();

deletePublication('publication-id');
```

#### `getPublicationById(id)`
Get a specific publication by ID.

```tsx
const { getPublicationById } = usePublications();

const publication = getPublicationById('publication-id');
```

#### `getUserPublications(userId)`
Get all publications for a specific user.

```tsx
const { getUserPublications } = usePublications();

const userPublications = getUserPublications('user-id');
```

#### `getAllPublications()`
Fetch all publications from the database (not just current user's).

```tsx
const { getAllPublications } = usePublications();

const handleGetAll = async () => {
  try {
    const allPubs = await getAllPublications();
    console.log('All publications:', allPubs);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## Setup

The PublicationsProvider is already set up in the app layout (`src/app/layout.tsx`), so you can use `usePublications` anywhere in your application.

## Migration from Local State

### Before (Local State)
```tsx
const [publications, setPublications] = useState([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
  const fetchPublications = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from('publications')
      .select('*')
      .eq('user_id', user.id);
    setPublications(data || []);
    setLoading(false);
  };
  fetchPublications();
}, [user]);
```

### After (PublicationsContext)
```tsx
const { publications, loading } = usePublications();
```

## TypeScript Interface

```tsx
interface Publication {
  id: string;
  title: string;
  description: string;
  pdf_url: string;
  thumb_url: string | null;
  created_at: string;
  user_id: string;
}
```

## Example Component

See `src/components/examples/PublicationsUsage.tsx` for a complete example of how to use all the features of the PublicationsContext. 