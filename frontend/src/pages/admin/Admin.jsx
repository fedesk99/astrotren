import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  LogOut,
  Plus,
  Save,
  Trash2,
  Upload,
  GripVertical,
  X,
} from 'lucide-react';

import { supabase } from '../../lib/supabase';
import {
  createContent,
  deleteContent,
  extractStoragePath,
  listContent,
  removeStorageFile,
  reorderContent,
  updateContent,
  uploadImage,
} from '../../lib/contentApi';

import { optimizeImage } from '../../lib/imageOptimizer';

const ADMIN_EMAIL = 'astrotrengdln@gmail.com';


/* =========================================================
   YOUTUBE
========================================================= */

const detectYouTubeEmbedId = (url) => {
  if (!url) return '';

  const value = url.trim();

  // Playlist:
  // https://www.youtube.com/playlist?list=XXXXXXXX
  const playlistMatch = value.match(/[?&]list=([^&]+)/);

  if (playlistMatch) {
    return `videoseries?list=${playlistMatch[1]}`;
  }

  // Video:
  // https://www.youtube.com/watch?v=XXXXXXXXXXX
  const watchMatch = value.match(/[?&]v=([^&]+)/);

  if (watchMatch) {
    return watchMatch[1];
  }

  // Video corto:
  // https://youtu.be/XXXXXXXXXXX
  const shortMatch = value.match(/youtu\.be\/([^?&/]+)/);

  if (shortMatch) {
    return shortMatch[1];
  }

  // Si alguien pega directamente un embed:
  // https://www.youtube.com/embed/XXXXXXXXXXX
  const embedMatch = value.match(/youtube\.com\/embed\/([^?&/]+)/);

  if (embedMatch) {
    const id = embedMatch[1];

    if (value.includes('list=')) {
      const listMatch = value.match(/[?&]list=([^&]+)/);

      if (listMatch) {
        return `videoseries?list=${listMatch[1]}`;
      }
    }

    return id;
  }

  // Si se pega directamente un ID de video.
  if (/^[A-Za-z0-9_-]{11}$/.test(value)) {
    return value;
  }

  return '';
};


/* =========================================================
   SORTABLE
========================================================= */

const SortableRow = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className="flex items-center gap-3"
    >
      {children({ ...attributes, ...listeners })}
    </div>
  );
};


/* =========================================================
   LOGIN
========================================================= */

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();

    setBusy(true);
    setError('');

    const { error: signInError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (signInError) {
      setError('Email o contraseña incorrectos.');
    }

    setBusy(false);
  };

  return (
    <div className="min-h-screen bg-black px-4 py-20 text-white">
      <div className="mx-auto max-w-md rounded-xl border border-purple-900/60 bg-gray-950 p-8 shadow-2xl shadow-purple-950/30">
        <h1 className="page-title text-center text-4xl text-white">
          ADMIN
        </h1>

        <p className="mt-3 text-center text-sm text-gray-400">
          Panel privado de Astrotrén
        </p>

        <form onSubmit={submit} className="mt-8 space-y-5">
          <label className="block text-sm">
            Email

            <input
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded border border-gray-700 bg-black px-4 py-3 text-white"
            />
          </label>

          <label className="block text-sm">
            Contraseña

            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded border border-gray-700 bg-black px-4 py-3 text-white"
            />
          </label>

          {error && (
            <p className="text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            disabled={busy}
            className="w-full rounded bg-purple-600 px-5 py-3 font-semibold hover:bg-purple-700 disabled:opacity-50"
          >
            {busy ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>

        <Link
          to="/"
          className="mt-6 block text-center text-sm text-gray-500 hover:text-purple-400"
        >
          Volver al sitio
        </Link>
      </div>
    </div>
  );
};


/* =========================================================
   GENERIC FIELD
========================================================= */

const Field = ({
  label,
  value,
  onChange,
  type = 'text',
  textarea = false,
}) => (
  <label className="block text-sm text-gray-300">
    {label}

    {textarea ? (
      <textarea
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="mt-2 w-full rounded border border-gray-700 bg-black px-3 py-2 text-white"
      />
    ) : (
      <input
        type={type}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded border border-gray-700 bg-black px-3 py-2 text-white"
      />
    )}
  </label>
);


/* =========================================================
   MUSIC
========================================================= */

const MusicEditor = ({
  items,
  setItems,
  reload,
  nextPosition,
}) => {
  const empty = {
    title: '',
    url: '',
    embed_id: '',
  };

  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    })
  );

  const save = async () => {
    try {
      const embed_id = detectYouTubeEmbedId(form.url);

      if (!embed_id) {
        alert(
          'No se pudo detectar un enlace válido de YouTube.'
        );
        return;
      }

      const values = {
        title: form.title,
        url: form.url,
        embed_id,
        position:
          editing?.position ??
          nextPosition,
      };

      if (editing) {
        await updateContent(
          'playlists',
          editing.id,
          values
        );
      } else {
        await createContent(
          'playlists',
          values
        );
      }

      setForm(empty);
      setEditing(null);

      await reload();
    } catch (error) {
      console.error(
        'Error guardando playlist:',
        error
      );

      alert(
        error?.message ||
        'No se pudo guardar la playlist.'
      );
    }
  };

  const onDragEnd = async ({
    active,
    over,
  }) => {
    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = items.findIndex(
      (item) => item.id === active.id
    );

    const newIndex = items.findIndex(
      (item) => item.id === over.id
    );

    const reordered = arrayMove(
      items,
      oldIndex,
      newIndex
    );

    setItems(reordered);

    try {
      await reorderContent(
        'playlists',
        reordered
      );
    } catch (error) {
      console.error(
        'Error reordenando música:',
        error
      );

      alert(
        error?.message ||
        'No se pudo guardar el nuevo orden.'
      );

      await reload();
    }
  };

  return (
    <Section
      title="Música"
      onAdd={() => {
        setEditing(null);
        setForm(empty);
      }}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {items.map((item) => (
              <SortableRow
                key={item.id}
                id={item.id}
              >
                {(dragProps) => (
                  <div className="flex w-full items-center gap-3 rounded border border-gray-800 bg-gray-950 p-4">
                    <button
                      {...dragProps}
                      className="cursor-grab text-gray-500"
                      aria-label="Reordenar"
                    >
                      <GripVertical />
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="font-semibold">
                        {item.title}
                      </div>

                      <div className="truncate text-xs text-gray-500">
                        {item.url}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        className="admin-btn"
                        onClick={() => {
                          setEditing(item);

                          setForm({
                            title: item.title || '',
                            url: item.url || '',
                            embed_id:
                              item.embed_id || '',
                          });
                        }}
                      >
                        Editar
                      </button>

                      <button
                        className="admin-btn danger"
                        onClick={async () => {
                          if (
                            !window.confirm(
                              '¿Eliminar esta playlist?'
                            )
                          ) {
                            return;
                          }

                          await deleteContent(
                            'playlists',
                            item.id
                          );

                          await reload();
                        }}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                )}
              </SortableRow>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <EditorCard
        title={
          editing
            ? 'Editar playlist'
            : 'Nueva playlist'
        }
        onCancel={() => {
          setEditing(null);
          setForm(empty);
        }}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="Título"
            value={form.title}
            onChange={(v) =>
              setForm({
                ...form,
                title: v,
              })
            }
          />

          <Field
            label="URL de YouTube"
            value={form.url}
            onChange={(v) =>
              setForm({
                ...form,
                url: v,
              })
            }
          />
        </div>

        <p className="mt-3 text-xs text-gray-500">
          Pegá la URL normal de YouTube. El Embed ID se detecta automáticamente.
        </p>

        <SaveButton onClick={save} />
      </EditorCard>
    </Section>
  );
};


/* =========================================================
   SHOWS
========================================================= */

const ShowsEditor = ({
  items,
  setItems,
  reload,
  nextPosition,
}) => {
  const empty = {
    date: '',
    time: '',
    venue: '',
    address: '',
  };

  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    })
  );

  const save = async () => {
    try {
      const values = {
        ...form,
        position:
          editing?.position ??
          nextPosition,
      };

      if (editing) {
        await updateContent(
          'shows',
          editing.id,
          values
        );
      } else {
        await createContent(
          'shows',
          values
        );
      }

      setForm(empty);
      setEditing(null);

      await reload();
    } catch (error) {
      console.error(
        'Error guardando show:',
        error
      );

      alert(
        error?.message ||
        'No se pudo guardar el show.'
      );
    }
  };

  const onDragEnd = async ({
    active,
    over,
  }) => {
    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = items.findIndex(
      (item) => item.id === active.id
    );

    const newIndex = items.findIndex(
      (item) => item.id === over.id
    );

    const reordered = arrayMove(
      items,
      oldIndex,
      newIndex
    );

    setItems(reordered);

    try {
      await reorderContent(
        'shows',
        reordered
      );
    } catch (error) {
      console.error(
        'Error reordenando shows:',
        error
      );

      alert(
        error?.message ||
        'No se pudo guardar el nuevo orden.'
      );

      await reload();
    }
  };

  return (
    <Section
      title="Shows"
      onAdd={() => {
        setEditing(null);
        setForm(empty);
      }}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {items.map((item) => (
              <SortableRow
                key={item.id}
                id={item.id}
              >
                {(dragProps) => (
                  <div className="flex w-full items-center gap-3 rounded border border-gray-800 bg-gray-950 p-4">
                    <button
                      {...dragProps}
                      className="cursor-grab text-gray-500"
                      aria-label="Reordenar"
                    >
                      <GripVertical />
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="font-semibold">
                        {new Date(
                          `${item.date}T00:00:00`
                        ).toLocaleDateString(
                          'es-AR',
                          {
                            dateStyle: 'long',
                          }
                        )}

                        {item.time &&
                          ` · ${item.time}`}
                      </div>

                      <div className="text-gray-400">
                        {item.venue}

                        {item.address &&
                          ` · ${item.address}`}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        className="admin-btn"
                        onClick={() => {
                          setEditing(item);
                          setForm(item);
                        }}
                      >
                        Editar
                      </button>

                      <button
                        className="admin-btn danger"
                        onClick={async () => {
                          if (
                            !window.confirm(
                              '¿Eliminar este show?'
                            )
                          ) {
                            return;
                          }

                          await deleteContent(
                            'shows',
                            item.id
                          );

                          await reload();
                        }}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                )}
              </SortableRow>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <EditorCard
        title={
          editing
            ? 'Editar show'
            : 'Nuevo show'
        }
        onCancel={() => {
          setEditing(null);
          setForm(empty);
        }}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="Fecha"
            type="date"
            value={form.date}
            onChange={(v) =>
              setForm({
                ...form,
                date: v,
              })
            }
          />

          <Field
            label="Hora"
            type="time"
            value={form.time}
            onChange={(v) =>
              setForm({
                ...form,
                time: v,
              })
            }
          />

          <Field
            label="Lugar"
            value={form.venue}
            onChange={(v) =>
              setForm({
                ...form,
                venue: v,
              })
            }
          />

          <Field
            label="Dirección"
            value={form.address}
            onChange={(v) =>
              setForm({
                ...form,
                address: v,
              })
            }
          />
        </div>

        <SaveButton onClick={save} />
      </EditorCard>
    </Section>
  );
};


/* =========================================================
   GALLERY
========================================================= */

const GalleryEditor = ({
  items,
  setItems,
  reload,
  nextPosition,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    })
  );

  const upload = async (e) => {
    try {
      const files = Array.from(
        e.target.files || []
      );

      for (const original of files) {
        const file =
          await optimizeImage(original);

        const { url } =
          await uploadImage(
            file,
            'gallery'
          );

        await createContent(
          'gallery',
          {
            image_url: url,
            caption: '',
            position:
              nextPosition +
              items.length,
          }
        );
      }

      e.target.value = '';

      await reload();
    } catch (error) {
      console.error(
        'Error subiendo imagen:',
        error
      );

      alert(
        error?.message ||
        'No se pudo subir la imagen.'
      );

      e.target.value = '';
    }
  };

  const saveCaption = async (
    item,
    value
  ) => {
    setItems((current) =>
      current.map((i) =>
        i.id === item.id
          ? {
              ...i,
              caption: value,
            }
          : i
      )
    );

    try {
      await updateContent(
        'gallery',
        item.id,
        {
          caption: value,
        }
      );
    } catch (error) {
      console.error(
        'Error guardando pie de foto:',
        error
      );

      alert(
        error?.message ||
        'No se pudo guardar el pie de foto.'
      );

      await reload();
    }
  };

  const onDragEnd = async ({
    active,
    over,
  }) => {
    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = items.findIndex(
      (i) => i.id === active.id
    );

    const newIndex = items.findIndex(
      (i) => i.id === over.id
    );

    const reordered = arrayMove(
      items,
      oldIndex,
      newIndex
    );

    setItems(reordered);

    try {
      await reorderContent(
        'gallery',
        reordered
      );
    } catch (error) {
      console.error(
        'Error reordenando galería:',
        error
      );

      alert(
        error?.message ||
        'No se pudo guardar el nuevo orden.'
      );

      await reload();
    }
  };

  const remove = async (item) => {
    if (
      !window.confirm(
        '¿Eliminar esta foto?'
      )
    ) {
      return;
    }

    try {
      await deleteContent(
        'gallery',
        item.id
      );

      const path =
        extractStoragePath(
          item.image_url
        );

      if (path) {
        await removeStorageFile(path);
      }

      await reload();
    } catch (error) {
      console.error(
        'Error eliminando foto:',
        error
      );

      alert(
        error?.message ||
        'No se pudo eliminar la foto.'
      );

      await reload();
    }
  };

  return (
    <Section title="Galería">
      <label className="mb-6 inline-flex cursor-pointer items-center gap-2 rounded bg-purple-600 px-4 py-2 font-semibold hover:bg-purple-700">
        <Upload size={18} />
        Agregar fotos

        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={upload}
        />
      </label>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <SortableContext
          items={items.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {items.map((item) => (
              <SortableRow
                key={item.id}
                id={item.id}
              >
                {(dragProps) => (
                  <div className="flex w-full items-center gap-3 rounded border border-gray-800 bg-gray-950 p-3">
                    <button
                      {...dragProps}
                      className="cursor-grab text-gray-500"
                      aria-label="Reordenar"
                    >
                      <GripVertical />
                    </button>

                    <img
                      src={item.image_url}
                      alt={item.caption || ''}
                      className="h-20 w-24 rounded object-cover"
                    />

                    <input
                      value={item.caption || ''}
                      onChange={(e) =>
                        setItems((current) =>
                          current.map((i) =>
                            i.id === item.id
                              ? {
                                  ...i,
                                  caption:
                                    e.target.value,
                                }
                              : i
                          )
                        )
                      }
                      onBlur={(e) =>
                        saveCaption(
                          item,
                          e.target.value
                        )
                      }
                      className="min-w-0 flex-1 rounded border border-gray-700 bg-black px-3 py-2 text-white"
                      placeholder="Pie de foto"
                    />

                    <button
                      className="text-red-400"
                      onClick={() =>
                        remove(item)
                      }
                      aria-label="Eliminar"
                    >
                      <Trash2 />
                    </button>
                  </div>
                )}
              </SortableRow>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </Section>
  );
};


/* =========================================================
   PRODUCT IMAGES
========================================================= */

const ProductImages = ({
  images,
  setImages,
  onRemoveImage,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    })
  );

  const onDragEnd = ({
    active,
    over,
  }) => {
    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = images.findIndex(
      (image, index) =>
        (image.id || `new-${index}`) ===
        active.id
    );

    const newIndex = images.findIndex(
      (image, index) =>
        (image.id || `new-${index}`) ===
        over.id
    );

    setImages(
      arrayMove(
        images,
        oldIndex,
        newIndex
      )
    );
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <SortableContext
        items={images.map(
          (image, index) =>
            image.id || `new-${index}`
        )}
        strategy={horizontalListSortingStrategy}
      >
        <div className="mt-4 flex flex-wrap gap-3">
          {images.map((image, index) => {
            const id =
              image.id ||
              `new-${index}`;

            return (
              <SortableRow
                key={id}
                id={id}
              >
                {(dragProps) => (
                  <div className="relative w-32 rounded border border-gray-700 bg-black p-2">
                    <button
                      type="button"
                      className="absolute left-2 top-2 z-10 cursor-grab text-gray-300"
                      {...dragProps}
                      aria-label="Reordenar imagen"
                    >
                      <GripVertical
                        size={18}
                      />
                    </button>

                    <img
                      src={image.url}
                      alt={
                        image.label || ''
                      }
                      className="h-24 w-full rounded object-contain"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        onRemoveImage(
                          index
                        )
                      }
                      className="absolute right-2 top-2 text-red-400"
                      aria-label="Eliminar imagen"
                    >
                      <X size={16} />
                    </button>

                    <input
                      value={
                        image.label || ''
                      }
                      onChange={(e) =>
                        setImages(
                          images.map(
                            (
                              current,
                              i
                            ) =>
                              i === index
                                ? {
                                    ...current,
                                    label:
                                      e.target
                                        .value,
                                  }
                                : current
                          )
                        )
                      }
                      className="mt-2 w-full bg-gray-900 px-2 py-1 text-xs text-white"
                      placeholder="Etiqueta"
                    />
                  </div>
                )}
              </SortableRow>
            );
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
};


/* =========================================================
   SHOP
========================================================= */

const ProductEditor = ({
  items,
  setItems,
  reload,
  nextPosition,
}) => {
  const empty = {
    name: '',
    price: '',
    description: '',
    images: [],
  };

  const [form, setForm] = useState(empty);
  const [editing, setEditing] =
    useState(null);

  const [
    removedExistingPaths,
    setRemovedExistingPaths,
  ] = useState([]);

  const [
    newlyUploadedPaths,
    setNewlyUploadedPaths,
  ] = useState([]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    })
  );

  const resetEditor = async (
    deleteNewUploads = false
  ) => {
    if (deleteNewUploads) {
      for (const path of newlyUploadedPaths) {
        try {
          await removeStorageFile(path);
        } catch (error) {
          console.error(
            'No se pudo eliminar archivo temporal:',
            error
          );
        }
      }
    }

    setForm(empty);
    setEditing(null);
    setRemovedExistingPaths([]);
    setNewlyUploadedPaths([]);
  };

  const upload = async (e) => {
    try {
      const added = [];

      for (const original of Array.from(
        e.target.files || []
      )) {
        const file =
          await optimizeImage(original);

        const uploaded =
          await uploadImage(
            file,
            'products'
          );

        added.push({
          url: uploaded.url,
          label: '',
          storagePath:
            uploaded.path,
          isNew: true,
        });

        setNewlyUploadedPaths(
          (current) => [
            ...current,
            uploaded.path,
          ]
        );
      }

      setForm((current) => ({
        ...current,
        images: [
          ...current.images,
          ...added,
        ],
      }));

      e.target.value = '';
    } catch (error) {
      console.error(
        'Error subiendo imagen:',
        error
      );

      alert(
        error?.message ||
        'No se pudo subir la imagen.'
      );

      e.target.value = '';
    }
  };

  const removeImage = async (index) => {
    const image = form.images[index];

    if (!image) return;

    const path =
      image.storagePath ||
      extractStoragePath(image.url);

    // Si la imagen ya existía en Supabase,
    // no la borramos todavía. La dejamos marcada
    // para eliminarla solamente cuando se guarde.
    if (editing && !image.isNew && path) {
      setRemovedExistingPaths((current) => [
        ...current,
        path,
      ]);
    }

    // Si la imagen fue subida durante esta edición,
    // podemos borrarla inmediatamente porque todavía
    // no forma parte del producto guardado en la DB.
    if (image.isNew && path) {
      try {
        await removeStorageFile(path);

        setNewlyUploadedPaths((current) =>
          current.filter((item) => item !== path)
        );
      } catch (error) {
        console.error(
          'No se pudo eliminar la imagen recién subida:',
          error
        );

        alert(
          error?.message ||
            'No se pudo eliminar la imagen. La imagen seguirá en el editor.'
        );

        return;
      }
    }

    setForm((current) => ({
      ...current,
      images: current.images.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const save = async () => {
    try {
      if (!form.name.trim()) {
        alert(
          'Ingresá un nombre para el producto.'
        );
        return;
      }

      const values = {
        name: form.name,
        price: Number(form.price),
        description:
          form.description,
        images: form.images.map(
          (image) => ({
            url: image.url,
            label:
              image.label || '',
          })
        ),
        position:
          editing?.position ??
          nextPosition,
      };

      if (editing) {
        await updateContent(
          'products',
          editing.id,
          values
        );

        // Ahora sí eliminamos de Storage
        // las imágenes que el usuario quitó.
        for (const path of [
          ...new Set(
            removedExistingPaths
          ),
        ]) {
          try {
            await removeStorageFile(
              path
            );
          } catch (error) {
            console.error(
              'No se pudo eliminar imagen anterior:',
              error
            );
          }
        }
      } else {
        await createContent(
          'products',
          values
        );
      }

      setForm(empty);
      setEditing(null);
      setRemovedExistingPaths([]);
      setNewlyUploadedPaths([]);

      await reload();
    } catch (error) {
      console.error(
        'Error guardando producto:',
        error
      );

      alert(
        error?.message ||
        'No se pudo guardar el producto.'
      );
    }
  };

  const startEdit = (item) => {
    setEditing(item);

    setForm({
      name: item.name || '',
      price: item.price ?? '',
      description:
        item.description || '',
      images: (item.images || []).map(
        (image) => ({
          ...image,
          isNew: false,
        })
      ),
    });

    setRemovedExistingPaths([]);
    setNewlyUploadedPaths([]);
  };

  const onDragProducts = async ({
    active,
    over,
  }) => {
    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = items.findIndex(
      (item) => item.id === active.id
    );

    const newIndex = items.findIndex(
      (item) => item.id === over.id
    );

    const reordered = arrayMove(
      items,
      oldIndex,
      newIndex
    );

    setItems(reordered);

    try {
      await reorderContent(
        'products',
        reordered
      );
    } catch (error) {
      console.error(
        'Error reordenando productos:',
        error
      );

      alert(
        error?.message ||
        'No se pudo guardar el nuevo orden.'
      );

      await reload();
    }
  };

  const deleteProduct = async (
    item
  ) => {
    if (
      !window.confirm(
        '¿Eliminar este producto?'
      )
    ) {
      return;
    }

    try {
      for (const image of
        item.images || []) {
        const path =
          extractStoragePath(
            image.url
          );

        if (path) {
          await removeStorageFile(
            path
          );
        }
      }

      await deleteContent(
        'products',
        item.id
      );

      await reload();
    } catch (error) {
      console.error(
        'Error eliminando producto:',
        error
      );

      alert(
        error?.message ||
        'No se pudo eliminar el producto.'
      );

      await reload();
    }
  };

  const cancel = async () => {
    await resetEditor(true);
  };

  return (
    <Section
      title="Tienda"
      onAdd={() => {
        setEditing(null);
        setForm(empty);
        setRemovedExistingPaths([]);
        setNewlyUploadedPaths([]);
      }}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragProducts}
      >
        <SortableContext
          items={items.map(
            (item) => item.id
          )}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {items.map((item) => (
              <SortableRow
                key={item.id}
                id={item.id}
              >
                {(dragProps) => (
                  <div className="flex w-full items-center gap-3 rounded border border-gray-800 bg-gray-950 p-4">
                    <button
                      {...dragProps}
                      className="cursor-grab text-gray-500"
                      aria-label="Reordenar producto"
                    >
                      <GripVertical />
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="font-semibold">
                        {item.name}
                      </div>

                      <div className="text-purple-400">
                        $
                        {Number(
                          item.price
                        ).toLocaleString(
                          'es-AR'
                        )}
                      </div>

                      <div className="text-sm text-gray-500">
                        {item.description}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        className="admin-btn"
                        onClick={() =>
                          startEdit(item)
                        }
                      >
                        Editar
                      </button>

                      <button
                        className="admin-btn danger"
                        onClick={() =>
                          deleteProduct(
                            item
                          )
                        }
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                )}
              </SortableRow>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <EditorCard
        title={
          editing
            ? 'Editar producto'
            : 'Nuevo producto'
        }
        onCancel={cancel}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="Nombre"
            value={form.name}
            onChange={(v) =>
              setForm({
                ...form,
                name: v,
              })
            }
          />

          <Field
            label="Precio"
            type="number"
            value={form.price}
            onChange={(v) =>
              setForm({
                ...form,
                price: v,
              })
            }
          />

          <div className="md:col-span-2">
            <Field
              label="Descripción"
              textarea
              value={form.description}
              onChange={(v) =>
                setForm({
                  ...form,
                  description: v,
                })
              }
            />
          </div>
        </div>

        <label className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded border border-purple-500 px-4 py-2 text-sm text-purple-300 hover:bg-purple-500/10">
          <Upload size={16} />
          Agregar fotos

          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={upload}
          />
        </label>

        <ProductImages
          images={form.images}
          setImages={(images) =>
            setForm((current) => ({
              ...current,
              images,
            }))
          }
          onRemoveImage={
            removeImage
          }
        />

        <SaveButton onClick={save} />
      </EditorCard>
    </Section>
  );
};


/* =========================================================
   UI HELPERS
========================================================= */

const Section = ({
  title,
  onAdd,
  children,
}) => (
  <section>
    <div className="mb-5 flex items-center justify-between">
      <h2 className="text-2xl font-bold text-purple-300">
        {title}
      </h2>

      {onAdd && (
        <button
          onClick={onAdd}
          className="admin-btn"
        >
          <Plus size={16} />
          Nuevo
        </button>
      )}
    </div>

    {children}
  </section>
);


const EditorCard = ({
  title,
  onCancel,
  children,
}) => (
  <div className="mt-8 rounded-xl border border-purple-900/60 bg-black p-5">
    <div className="mb-5 flex items-center justify-between">
      <h3 className="text-lg font-semibold">
        {title}
      </h3>

      {onCancel && (
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-white"
          aria-label="Cancelar"
        >
          <X />
        </button>
      )}
    </div>

    {children}
  </div>
);


const SaveButton = ({
  onClick,
}) => (
  <button
    onClick={onClick}
    className="mt-6 inline-flex items-center gap-2 rounded bg-purple-600 px-5 py-2 font-semibold hover:bg-purple-700"
  >
    <Save size={17} />
    Guardar
  </button>
);


/* =========================================================
   ADMIN DASHBOARD
========================================================= */

const AdminDashboard = () => {
  const [tab, setTab] =
    useState('music');

  const [data, setData] =
    useState({
      playlists: [],
      shows: [],
      gallery: [],
      products: [],
    });

  const [loading, setLoading] =
    useState(true);

  const load = async () => {
    setLoading(true);

    try {
      const results =
        await Promise.all(
          [
            'playlists',
            'shows',
            'gallery',
            'products',
          ].map(listContent)
        );

      const [
        playlists,
        shows,
        gallery,
        products,
      ] = results;

      setData({
        playlists,
        shows,
        gallery,
        products,
      });
    } catch (err) {
      console.error(
        'Error cargando contenido desde Supabase:',
        err
      );

      alert(
        `Error de Supabase:\n\n${
          err?.message ||
          JSON.stringify(err)
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const nextPosition = (
    items
  ) =>
    items.length
      ? Math.max(
          ...items.map(
            (item) =>
              item.position ?? 0
          )
        ) + 1
      : 0;

  const tabs = [
    {
      id: 'music',
      label: 'Música',
    },
    {
      id: 'shows',
      label: 'Shows',
    },
    {
      id: 'gallery',
      label: 'Galería',
    },
    {
      id: 'shop',
      label: 'Tienda',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-gray-800 bg-gray-950">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <div className="page-title text-2xl">
              ASTROTRÉN
            </div>

            <div className="text-sm text-gray-500">
              Administración
            </div>
          </div>

          <button
            className="admin-btn"
            onClick={() =>
              supabase.auth.signOut()
            }
          >
            <LogOut size={16} />
            Salir
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <nav className="mb-8 flex flex-wrap gap-2 border-b border-gray-800 pb-4">
          {tabs.map((item) => (
            <button
              key={item.id}
              onClick={() =>
                setTab(item.id)
              }
              className={`rounded px-4 py-2 text-sm font-semibold ${
                tab === item.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-900 text-gray-400 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {loading ? (
          <div className="rounded border border-gray-800 bg-gray-950 p-8 text-center text-gray-400">
            Cargando contenido…
          </div>
        ) : (
          <>
            {tab === 'music' && (
              <MusicEditor
                items={data.playlists}
                setItems={(items) =>
                  setData((current) => ({
                    ...current,
                    playlists:
                      typeof items ===
                      'function'
                        ? items(
                            current.playlists
                          )
                        : items,
                  }))
                }
                reload={load}
                nextPosition={nextPosition(
                  data.playlists
                )}
              />
            )}

            {tab === 'shows' && (
              <ShowsEditor
                items={data.shows}
                setItems={(items) =>
                  setData((current) => ({
                    ...current,
                    shows:
                      typeof items ===
                      'function'
                        ? items(
                            current.shows
                          )
                        : items,
                  }))
                }
                reload={load}
                nextPosition={nextPosition(
                  data.shows
                )}
              />
            )}

            {tab === 'gallery' && (
              <GalleryEditor
                items={data.gallery}
                setItems={(items) =>
                  setData((current) => ({
                    ...current,
                    gallery:
                      typeof items ===
                      'function'
                        ? items(
                            current.gallery
                          )
                        : items,
                  }))
                }
                reload={load}
                nextPosition={nextPosition(
                  data.gallery
                )}
              />
            )}

            {tab === 'shop' && (
              <ProductEditor
                items={data.products}
                setItems={(items) =>
                  setData((current) => ({
                    ...current,
                    products:
                      typeof items ===
                      'function'
                        ? items(
                            current.products
                          )
                        : items,
                  }))
                }
                reload={load}
                nextPosition={nextPosition(
                  data.products
                )}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
};


/* =========================================================
   ADMIN
========================================================= */

const Admin = () => {
  const [session, setSession] =
    useState(undefined);

  useEffect(() => {
    const meta =
      document.createElement('meta');

    meta.name = 'robots';
    meta.content =
      'noindex,nofollow,noarchive';

    document.head.appendChild(meta);

    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  useEffect(() => {
    if (!supabase) {
      setSession(null);
      return;
    }

    supabase.auth
      .getSession()
      .then(({ data }) => {
        setSession(data.session);
      });

    const {
      data: listener,
    } =
      supabase.auth.onAuthStateChange(
        (_event, next) => {
          setSession(next);
        }
      );

    return () =>
      listener.subscription.unsubscribe();
  }, []);

  if (session === undefined) {
    return (
      <div className="min-h-screen bg-black" />
    );
  }

  if (!supabase) {
    return (
      <div className="min-h-screen bg-black p-8 text-white">
        Falta configurar Supabase.
      </div>
    );
  }

  if (!session) {
    return <Login />;
  }

  if (
    session.user.email?.toLowerCase() !==
    ADMIN_EMAIL.toLowerCase()
  ) {
    return (
      <div className="min-h-screen bg-black p-8 text-white">
        <p>
          No tenés permisos para acceder.
        </p>

        <button
          className="admin-btn mt-4"
          onClick={() =>
            supabase.auth.signOut()
          }
        >
          Cerrar sesión
        </button>
      </div>
    );
  }

  return (
    <AdminDashboard
      session={session}
    />
  );
};

export default Admin;