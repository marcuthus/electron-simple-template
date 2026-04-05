# 🌌 Electron Template - Project Guidelines

Este documento serve como a fonte da verdade para o desenvolvimento deste projeto, seguindo a metodologia **Agile Extreme Programming (XP)**. Siga estas diretrizes rigorosamente para garantir a consistência e a qualidade do código.

---

## 🛠️ Tech Stack & Arquitetura

- **Frontend**: React com Vite (Vite deve ser `devDependency`).
- **Backend / Desktop**: Electron (Electron deve ser `devDependency`).
- **Roteamento**: `react-router-dom@6` utilizando `HashRouter`.
- **Estilização**: Tailwind CSS (`devDependencies`).
- **UI Components**: Shadcn UI (Padrão de composição).
- **Validação**: Zod + React Hook Form (usando o componente `Field`).

### 🏗️ Arquitetura do Sistema

O sistema utiliza uma arquitetura de processo segregado típica do Electron:

1.  **Main Process (Backend)**:
    - Responsável pela integração com o sistema operacional e acesso direto ao sistema de arquivos.
    - Organizado em **Handlers** (`electron/handlers`) que registram endpoints IPC.
    - Utiliza o padrão `ipcMain.handle` para responder a solicitações do Renderer.
    - Centraliza lógica de negócio pesada, segurança (bcrypt, jwt) e operações de arquivo.

2.  **Preload Script**:
    - Ponte de segurança entre o Main e o Renderer.
    - Expõe seletivamente o `ipcRenderer` via `contextBridge.exposeInMainWorld`.

3.  **Renderer Process (Frontend)**:
    - Interface do usuário construída com React.
    - Comunica-se com o Main Process exclusivamente via `window.ipcRenderer.invoke`.
    - Mantém o estado da UI e validações de formulário.

4.  **Fluxo de Dados**:
    - `UI Event -> window.ipcRenderer.invoke("channel", data) -> Preload -> Main Handler`.

---

## 📏 Regras de Ouro (Strict Rules)

1.  **📦 Gerenciamento de Dependências**:
    - **CRÍTICO**: Sempre separe dependências de produção das de desenvolvimento.
    - Ferramentas de build, CLIs e compiladores (`eslint`, `prettier`, `vite`, `electron`) **DEVEM** ser instaladas com `--save-dev` (-D).
2.  **🧩 Padrão de Componentes**:
    - Use o **padrão de composição** para todos os componentes React.
    - Priorize a reutilização e a legibilidade.
3.  **📖 Requisitos**:
    - Consulte sempre o arquivo `requirements-gathering.md` para entender as regras de negócio e os fluxos do sistema.
4.  **🚀 Execução**:
    - Utilize exclusivamente os comandos definidos no `package.json` para tarefas de desenvolvimento, build e formatação.

5.  **💅 Formatação de Código**:
    - **Ponto e Vírgula**: NÃO utilize ponto e vírgula (`;`).
    - **Aspas**: Utilize sempre aspas duplas (`"`).
    - **Indentação**: Utilize 4 espaços para indentação.
    - **Linhas em Branco**: Evite linhas em branco dentro de componentes para manter o código denso e compacto.
        - **Exceção 1**: Sempre salte uma linha antes do `return`.
        - **Exceção 2**: Salte uma linha antes e depois de `console.log` (a menos que sejam vários logs em sequência).
7.  **Variáveis de Ambiente**:
    - Utilize sempre a biblioteca `@marcuth/env` para gerenciar e validar variáveis de ambiente.
8.  **Ambiente de Execução (Windows)**:
    - O ambiente de desenvolvimento é Windows (compatibilidade com Windows 8 conforme requisitos).
    - **CRÍTICO**: Ao executar múltiplos comandos no terminal, utilize sempre o ponto e vírgula (`;`) como separador, e **NUNCA** utilize `&&` ou `&`, que não são suportados pelo PowerShell padrão nesta versão.
9.  **Comentários**:
    - **NUNCA** utilize comentários no código. 
    - O código deve ser autoexplicativo através de nomes de variáveis e funções claros.
10. **Padrão IPC**:
    - Os canais de comunicação IPC devem seguir o padrão `domínio:ação` (ex: `auth:login`, `user:create`).
11. **Nomenclatura Descritiva (CRÍTICO)**:
    - **NUNCA** utilize nomes de variáveis ou funções abreviados ou com apenas uma letra (exceto no método `sort`).
    - Em loops (`map`, `forEach`, `reduce`, etc.), utilize sempre nomes descritivos como `currentItem`, `current{Entity}`, `accumulator`, `index`.
    - Eventos devem ser nomeados como `event`, não `e`. Retornos de chamadas (callbacks) devem ser claros (ex: `newValue`, `updatedData`).
12. **Utilitários Centralizados**:
    - **NUNCA** crie funções auxiliares de formatação ou lógica genérica dentro dos componentes.
    - Utilize exclusivamente os arquivos em `src/utils/` (ex: `currency.ts`, `date.ts`, `text.ts`, `error.ts`).
    - Se precisar de uma nova função genérica, crie-a primeiro em `src/utils/` sem ponto e vírgula.

---

## ⚛️ Padrões de Código React

1.  **Importação**: 
    - Utilize sempre a desestruturação: `import { FC, useEffect, ... } from "react"`.
    - **NUNCA** utilize `import React from "react"` ou `import * as React from "react"`.
    - **CRÍTICO**: Ao importar apenas tipos (interfaces, types), utilize **sempre** `import type` ou `import { type X }` para separar valores de tipos em tempo de compilação.
2.  **Declaração de Componentes e Handlers**:
    - **NUNCA** utilize `function Name() {}` ou `function handle() {}`.
    - Utilize sempre `const`.
    - Para componentes: `const Component: FC<Props> = () => {}`.
3.  **Props**:
    - Declaração de props não deve ter prefixo (ex: evitar `IProps`, `TProps`, `ComponentProps`).
    - Na maioria das vezes, o tipo (use somente a declaração `type`) das props não deve ser exportado.
4.  **Formulários**: 
    - **NUNCA** utilize `...register`.
    - Utilize sempre o componente `Controller` do `react-hook-form`.
    - Integre com o componente `Field` para manter a consistência.
5.  **Schemas e Inferência de Tipos**:
    - Os valores inferidos de um schema Zod devem ser nomeados como `{Name}FormValues`. Ex: `type LoginFormValues = z.infer<typeof loginSchema>`.
    - **NUNCA** utilize sufixos como `Schema`, `Type`, `Interface` ou `Data` para nomear inferências de schema.

---

## 📂 Organização de Arquivos

Siga rigorosamente esta estrutura para garantir a escalabilidade:

### 🖥️ Electron (Backend)
- `electron/handlers/`: Lógica de IPC por domínio (ex: `user.handler.ts`).
- `electron/lib/`: Utilitários e instâncias globais (Backup, Crypto).
- `electron/main.ts`: Ponto de entrada, registro de handlers e ciclo de vida da app.
- `electron/preload.ts`: Exposição de APIs seguras para o frontend.

### ⚛️ SRC (Frontend)
1.  **Form Hooks**: Devem ser criados em `src/hooks/forms/{name}-form.hook.ts`.
2.  **Schemas**: Devem ser criados em `src/schemas/{name}.schema.ts`.
3.  **Regex Helpers**: Devem ser centralizados em `src/helpers/regex.helper.ts`.
4.  **Config Helpers**: Devem ser centralizados em `src/helpers/config.helper.ts`.
5.  **Pages**: Localizadas em `src/pages/{domain}/`. Devem conter o arquivo principal `{domain}.page.tsx`.
6.  **Utils**: Lógica genérica e formatadores em `src/utils/`.
7.  **Components**:
    - `src/components/ui/`: Componentes base (Shadcn UI).
    - `src/components/layout/`: Componentes de estrutura (Sidebar, Navbar).
8.  **Providers**: Contextos globais em `src/providers/`.

---

## 🎨 UI & Design (Shadcn UI)

> [!IMPORTANT]
> - O componente `Form` foi substituído pelo `Field`.
> - O componente `Toast` foi substituído pelo `Sonner`.
> - **CRÍTICO**: Todo e qualquer texto exibido na interface **DEVE** utilizar o componente `Typography`.
> - **CRÍTICO**: Todo e qualquer link estilizado **DEVE** utilizar o componente `Link` (`@/components/ui/link`).

### Uso do Typography
Importe e utilize sempre os subcomponentes do `Typography` para garantir consistência tipográfica:

```tsx
import { Typography } from "@/components/ui/typography"

<Typography.H1>Título principal</Typography.H1>
<Typography.P>Parágrafo comum</Typography.P>
<Typography.Small>Texto pequeno</Typography.Small>
```

### Componentes Disponíveis
Para adicionar um novo componente, use: `npx shadcn@latest add <nome-do-componente>` (em lowercase kebab-case).

| | | | |
|---|---|---|---|
| Accordion | Alert | Alert Dialog | Aspect Ratio |
| Avatar | Badge | Breadcrumb | Button |
| Button Group | Calendar | Card | Carousel |
| Chart | Checkbox | Collapsible | Combobox |
| Command | Context Menu | Data Table | Date Picker |
| Dialog | Direction | Drawer | Dropdown Menu |
| Empty | **Field** (Form) | Hover Card | Input |
| Input Group | Input OTP | Item | Kbd |
| Label | Menubar | Native Select | Navigation Menu |
| Pagination | Popover | Progress | Radio Group |
| Resizable | Scroll Area | Select | Separator |
| Sheet | Sidebar | Skeleton | Slider |
| **Sonner** (Toast) | Spinner | Switch | Table |
| Tabs | Textarea | Toggle | Toggle Group |
| Tooltip | Typography | | |

---

## 📝 Notas de Desenvolvimento

- **CRÍTICO: MOCAGEM DE DADOS**: Você **NÃO DEVE** fazer mocks se não for estritamente para os arquivos de teste. O código de produção deve estar tudo realmente funcional.
- **Testes e Cobertura**:
    - **CRÍTICO**: Testes devem ser criados **EXCLUSIVAMENTE** para o **Main Process (Backend)**.
    - **FRONTEND**: **NUNCA** crie testes para o Renderer Process (frontend) ou componentes React.
    - **OBRIGATÓRIO**: Sempre que houver alteração no código do backend, os testes DEVEM ser executados.
    - **COBERTURA**: O Main Process (`electron/`) deve manter **100% de cobertura** em todas as métricas (linhas, funções, branches, statements).
- **Pré-Commit (OBRIGATÓRIO)**: Antes de qualquer commit, execute **sempre**:
    1. `npm run lint:fix`
    2. `npm run format`
    3. Só então realize o commit com `git commit`.
