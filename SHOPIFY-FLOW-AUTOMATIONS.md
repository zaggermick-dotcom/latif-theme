# 🚀 Guide des Automatisations Shopify Flow - Ultra Puissant

Ce guide vous explique comment configurer les flows d'automatisation Shopify qui fonctionnent avec les éléments du thème Latif.

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Prérequis](#prérequis)
3. [Flows de Segmentation Client](#flows-de-segmentation-client)
4. [Flows de Gestion Produit](#flows-de-gestion-produit)
5. [Flows Marketing](#flows-marketing)
6. [Flows de Conversion](#flows-de-conversion)
7. [Flows d'Inventaire](#flows-dinventaire)
8. [Intégration avec le Thème](#intégration-avec-le-thème)

---

## Vue d'ensemble

Les automatisations Shopify Flow permettent de créer des workflows puissants qui déclenchent des actions automatiques. Ce thème inclut des snippets et sections spécialement conçus pour fonctionner avec ces automatisations.

### Fichiers du thème compatibles Flow

| Fichier | Description |
|---------|-------------|
| `snippets/automation-badges.liquid` | Badges automatiques (VIP, Bestseller, Nouveau, etc.) |
| `snippets/customer-segment-content.liquid` | Contenu conditionnel par segment client |
| `snippets/urgency-triggers.liquid` | Éléments d'urgence (stock faible, popularité) |
| `snippets/cart-upsell-automation.liquid` | Upsells automatisés dans le panier |
| `snippets/automation-notifications.liquid` | Notifications toast automatisées |
| `sections/vip-exclusive-content.liquid` | Section de contenu VIP exclusif |
| `sections/countdown-timer-automation.liquid` | Timer de compte à rebours promo |

---

## Prérequis

1. **Shopify Plan** : Shopify Advanced ou Shopify Plus (Flow est inclus)
2. **Accès Admin** : Allez dans **Apps > Flow** dans votre admin Shopify
3. **Thème installé** : Ce thème avec tous les snippets d'automatisation

---

## Flows de Segmentation Client

### Flow 1: Taguer les clients VIP automatiquement

**Déclencheur**: `Customer created` ou `Order paid`

**Conditions**:
- Total des commandes du client > 500€ OU
- Nombre de commandes > 5

**Actions**:
```
1. Ajouter le tag "vip" au client
2. Ajouter le tag "premium" au client
3. Envoyer notification interne
```

**Code de configuration Flow**:
```json
{
  "name": "Tag Client VIP Automatique",
  "trigger": "shopify/orders/paid",
  "conditions": [
    {
      "type": "or",
      "conditions": [
        { "field": "customer.total_spent", "operator": "greater_than", "value": "50000" },
        { "field": "customer.orders_count", "operator": "greater_than", "value": "5" }
      ]
    }
  ],
  "actions": [
    { "type": "add_customer_tags", "tags": ["vip", "premium", "gold"] }
  ]
}
```

---

### Flow 2: Identifier les nouveaux clients

**Déclencheur**: `Customer created`

**Actions**:
```
1. Ajouter tag "new-customer"
2. Planifier retrait du tag après 30 jours
```

---

### Flow 3: Clients à forte valeur (High-Value)

**Déclencheur**: `Order paid`

**Conditions**:
- Montant de la commande > 200€

**Actions**:
```
1. Ajouter tag "high-value"
2. Envoyer email de remerciement personnalisé
```

---

## Flows de Gestion Produit

### Flow 4: Taguer les Bestsellers automatiquement

**Déclencheur**: `Order created` (ou planifié quotidiennement)

**Logique**:
Utiliser l'API pour identifier les produits avec le plus de ventes sur les 30 derniers jours.

**Actions**:
```
1. Ajouter tag "bestseller" aux top 10 produits
2. Retirer le tag "bestseller" des autres produits
```

---

### Flow 5: Taguer les nouveaux produits

**Déclencheur**: `Product created`

**Actions**:
```
1. Ajouter tag "new" au produit
2. Planifier retrait du tag après 14 jours
```

**Configuration**:
```json
{
  "name": "Tag Nouveau Produit",
  "trigger": "shopify/products/create",
  "actions": [
    { "type": "add_product_tags", "tags": ["new", "nouveauté"] },
    {
      "type": "schedule_action",
      "delay": "14 days",
      "action": { "type": "remove_product_tags", "tags": ["new", "nouveauté"] }
    }
  ]
}
```

---

### Flow 6: Alertes de stock faible

**Déclencheur**: `Inventory quantity changed`

**Conditions**:
- Quantité d'inventaire <= 5
- Quantité d'inventaire > 0

**Actions**:
```
1. Ajouter tag "low-stock" au produit
2. Envoyer notification à l'équipe
3. (Optionnel) Envoyer email aux clients intéressés
```

---

### Flow 7: Produit en rupture de stock

**Déclencheur**: `Inventory quantity changed`

**Conditions**:
- Quantité d'inventaire = 0

**Actions**:
```
1. Ajouter tag "out-of-stock"
2. Retirer tag "low-stock"
3. Notification urgente à l'équipe
```

---

## Flows Marketing

### Flow 8: Ventes Flash automatiques

**Déclencheur**: Planifié (ex: tous les vendredis à 10h)

**Actions**:
```
1. Ajouter tag "flash-sale" aux produits de la collection Flash
2. Activer le code promo automatique
3. Planifier retrait après 24h
```

---

### Flow 9: Produits Tendance

**Déclencheur**: Quotidien

**Logique**:
Identifier les produits avec le plus de vues/ajouts au panier sur les 7 derniers jours.

**Actions**:
```
1. Ajouter tag "trending" aux produits tendance
2. Mettre à jour le métafield "popularity_score"
```

---

### Flow 10: Promo Anniversaire Client

**Déclencheur**: `Customer created` (avec planification anniversaire)

**Actions**:
```
1. Créer code promo personnalisé
2. Envoyer email anniversaire avec code
3. Ajouter tag "birthday-promo-sent"
```

---

## Flows de Conversion

### Flow 11: Panier abandonné - Séquence complète

**Déclencheur**: `Checkout abandoned`

**Séquence**:
```
1. Attendre 1 heure
2. Envoyer email rappel #1 (simple rappel)
3. Attendre 24 heures
4. Envoyer email rappel #2 (avec urgence)
5. Attendre 48 heures
6. Envoyer email rappel #3 (avec code promo -10%)
```

---

### Flow 12: Récompense post-achat

**Déclencheur**: `Order fulfilled`

**Conditions**:
- Première commande du client

**Actions**:
```
1. Attendre 7 jours
2. Envoyer email demande d'avis
3. Inclure code promo prochaine commande
```

---

### Flow 13: Winback - Clients inactifs

**Déclencheur**: Planifié quotidiennement

**Conditions**:
- Dernière commande > 90 jours
- Client non tagué "winback-sent"

**Actions**:
```
1. Ajouter tag "inactive"
2. Envoyer campagne winback
3. Créer code promo exclusif
4. Ajouter tag "winback-sent"
```

---

## Flows d'Inventaire

### Flow 14: Réapprovisionnement automatique

**Déclencheur**: `Inventory quantity changed`

**Conditions**:
- Quantité < seuil de réapprovisionnement (métafield)

**Actions**:
```
1. Créer brouillon de commande fournisseur
2. Notification à l'équipe achat
3. Ajouter tag "reorder-pending"
```

---

### Flow 15: Back in Stock - Notification clients

**Déclencheur**: `Inventory quantity changed`

**Conditions**:
- Ancienne quantité = 0
- Nouvelle quantité > 0

**Actions**:
```
1. Retirer tag "out-of-stock"
2. Envoyer email aux clients en liste d'attente
3. Notification push (si activé)
```

---

## Intégration avec le Thème

### Utilisation des snippets

#### 1. Badges automatiques dans les cartes produit

Dans `snippets/card-product.liquid` ou votre template produit, ajoutez :

```liquid
{% render 'automation-badges', product: product, badge_position: 'top-left', max_badges: 3 %}
```

#### 2. Contenu conditionnel par segment

```liquid
{% render 'customer-segment-content', 
   segment: 'vip',
   show_to_segment: true,
   content_html: '<div class="vip-banner">Bienvenue membre VIP ! -20% exclusif</div>'
%}
```

#### 3. Éléments d'urgence sur page produit

Dans `sections/main-product.liquid` :

```liquid
{% render 'urgency-triggers', product: product %}
```

#### 4. Upsells dans le panier

Dans `sections/cart-drawer.liquid` ou `templates/cart.json` :

```liquid
{% render 'cart-upsell-automation' %}
```

#### 5. Notifications automatisées

Dans `layout/theme.liquid` avant `</body>` :

```liquid
{% render 'automation-notifications' %}
```

### Sections à ajouter dans le thème editor

1. **Contenu VIP Exclusif** - Section pour afficher du contenu réservé aux VIP
2. **Timer Promo Automatisé** - Compte à rebours pour les promotions

---

## Tags supportés par le thème

### Tags Client
| Tag | Description | Utilisé par |
|-----|-------------|-------------|
| `vip` | Client VIP | customer-segment-content, vip-exclusive-content |
| `premium` | Client Premium | customer-segment-content |
| `gold` | Client Gold | customer-segment-content |
| `new-customer` | Nouveau client | customer-segment-content |
| `returning` | Client récurrent | customer-segment-content |
| `high-value` | Client forte valeur | customer-segment-content |
| `subscriber` | Abonné newsletter | customer-segment-content |
| `wholesale` | Client grossiste/B2B | customer-segment-content |

### Tags Produit
| Tag | Description | Utilisé par |
|-----|-------------|-------------|
| `vip` | Produit VIP exclusif | automation-badges |
| `bestseller` | Produit bestseller | automation-badges, urgency-triggers |
| `new` | Nouveau produit | automation-badges |
| `limited` | Édition limitée | automation-badges |
| `low-stock` | Stock faible | automation-badges, urgency-triggers |
| `promo` | En promotion | automation-badges |
| `trending` | Produit tendance | automation-badges, urgency-triggers |
| `eco-friendly` | Éco-responsable | automation-badges |
| `flash-sale` | Vente flash | urgency-triggers |
| `fast-selling` | Vente rapide | urgency-triggers |
| `last-chance` | Dernière chance | urgency-triggers |
| `ending-soon` | Fin imminente | urgency-triggers |
| `popular` | Populaire | urgency-triggers |

---

## Métafields personnalisés

### Produit
- `custom.badge_text` : Texte du badge personnalisé
- `custom.badge_color` : Couleur du badge personnalisé
- `custom.popularity_score` : Score de popularité (0-100)

### Client
- `custom.vip_level` : Niveau VIP (bronze, silver, gold, platinum)
- `custom.loyalty_points` : Points de fidélité

---

## Conseils d'optimisation

1. **Testez toujours** vos flows en environnement de développement
2. **Limitez les emails** : Max 3-4 emails automatiques par semaine par client
3. **Personnalisez** les messages avec les variables Liquid
4. **Monitorer** les performances des flows via les analytics Shopify
5. **Documentez** vos flows pour faciliter la maintenance

---

## Support

Pour toute question sur l'intégration des flows avec ce thème, consultez la documentation Shopify Flow ou contactez le support.

**Dernière mise à jour** : Février 2026
