# Shared Account / Settings Screens

Eight screens live flat under `app/` (not nested inside `requester/` or
`driver/`) and are reused across roles via their profile screens:
`personal-information.tsx`, `saved-addresses.tsx`, `emergency-contacts.tsx`,
`payment-methods.tsx`, `subscription.tsx`, `notifications.tsx`,
`help-support.tsx`, `terms-privacy.tsx`.

Each is self-contained — local `useState` seeded with a hardcoded mock
array/object, `router.back()` to return. **None of them call any
service.** Editing a contact, removing a saved address, toggling a
notification, or editing personal info is not persisted anywhere — it
resets the moment you navigate away and back.

## Who links to what

| Screen | Requester `ProfileScreen` | Driver dashboard `profile.tsx` | Driver store `(tabs)/profile.tsx` |
|---|:---:|:---:|:---:|
| `personal-information.tsx` | ✅ | ✅ | ✅ |
| `saved-addresses.tsx` | ✅ | ❌ | ❌ |
| `emergency-contacts.tsx` | ✅ | ✅ | ✅ |
| `payment-methods.tsx` | ✅ (`payment-methods`) | ✅ (keyed `linked-accounts`) | ✅ (keyed `linked-accounts`) |
| `subscription.tsx` | ✅ (`subscription-plan`) | ❌ | ❌ |
| `notifications.tsx` | ✅ | ✅ | ✅ |
| `help-support.tsx` | ✅ | ✅ | ✅ |
| `terms-privacy.tsx` | ✅ | ✅ | ✅ |

`saved-addresses` and `subscription` are requester-only by design —
addresses matter for supply delivery, a subscription plan is an ambulance
perk. The other six are genuinely shared.

## Duplication worth knowing about

There isn't one shared "account menu" component — `ProfileScreen.tsx`
(requester), `driver/dashboard/profile.tsx`, and
`driver/store/(tabs)/profile.tsx` each maintain their **own copy** of the
`routes` key→path map and their own local `ListItem` row component, even
though the visual design and behavior are nearly identical across all
three. If the account menu needs a new item or a style change, today that
means editing it in three places. A shared `components/AccountMenu.tsx` (or
similar) taking a list of `{ icon, label, route }` entries per role would
remove this duplication.
