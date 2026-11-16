/**
 * PrepInMinutes — Universal Code Template Generator & Multi-Language Buffer Engine
 *
 * Supported Languages:
 * 1. TypeScript (typescript) - Modern TS with strict interfaces and generics
 * 2. JavaScript (javascript) - Modern ES6+ with JSDoc typing
 * 3. Node.js (nodejs)       - Backend runtime with async I/O, streams, and module exports
 * 4. Python (python)         - Python 3 with PEP 484 type annotations and docstrings
 * 5. Java (java)             - Idiomatic Java with standard collections
 * 6. C++ (cpp)               - Modern C++20 with STL containers
 * 7. Go (go)                 - Idiomatic Go with structs and error handling
 */

export type SupportedLanguage =
  | "typescript"
  | "javascript"
  | "nodejs"
  | "python"
  | "java"
  | "cpp"
  | "go";

export interface LanguageConfig {
  id: SupportedLanguage;
  label: string;
  extension: string;
  monacoLanguage: string;
  badge: string;
  defaultVersion: string;
}

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  {
    id: "typescript",
    label: "TypeScript",
    extension: ".ts",
    monacoLanguage: "typescript",
    badge: "TS 5.x",
    defaultVersion: "5.4",
  },
  {
    id: "javascript",
    label: "JavaScript",
    extension: ".js",
    monacoLanguage: "javascript",
    badge: "ES2024",
    defaultVersion: "ES2024",
  },
  {
    id: "nodejs",
    label: "Node.js",
    extension: ".js",
    monacoLanguage: "javascript",
    badge: "Node v20",
    defaultVersion: "v20 LTS",
  },
  {
    id: "python",
    label: "Python",
    extension: ".py",
    monacoLanguage: "python",
    badge: "Python 3.12",
    defaultVersion: "3.12",
  },
  {
    id: "java",
    label: "Java",
    extension: ".java",
    monacoLanguage: "java",
    badge: "Java 21",
    defaultVersion: "OpenJDK 21",
  },
  {
    id: "cpp",
    label: "C++",
    extension: ".cpp",
    monacoLanguage: "cpp",
    badge: "C++20",
    defaultVersion: "GCC 13 / C++20",
  },
  {
    id: "go",
    label: "Go",
    extension: ".go",
    monacoLanguage: "go",
    badge: "Go 1.22",
    defaultVersion: "1.22",
  },
];

export interface TemplateGenerationContext {
  domainSlug?: string;
  topicSlug?: string;
  topicTitle?: string;
  questionId?: string;
  questionTitle?: string;
  prompt?: string;
  difficulty?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
  learningLevel?: string;
  archetype?: string;
  expectedKeywords?: string[];
}

/**
 * Sanitizes a title string into a PascalCase identifier for classes/interfaces.
 */
function toPascalCase(title: string): string {
  if (!title) return "Solution";
  const cleaned = title.replace(/[^a-zA-Z0-9\s]/g, " ");
  const words = cleaned.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "Solution";
  return words
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join("");
}

/**
 * Sanitizes a title string into a camelCase identifier for functions/methods.
 */
function toCamelCase(title: string): string {
  const pascal = toPascalCase(title);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

/**
 * Synthesizes a calibrated starter code skeleton for the specified language and question context.
 */
export function generateStarterCode(
  lang: SupportedLanguage,
  ctx: TemplateGenerationContext = {}
): string {
  const domain = (ctx.domainSlug || "").toLowerCase();
  const title = ctx.questionTitle || ctx.topicTitle || "Coding Problem";
  const className = toPascalCase(title);
  const fnName = toCamelCase(title) || "solve";
  const difficulty = ctx.difficulty || "INTERMEDIATE";
  const promptSummary = ctx.prompt
    ? ctx.prompt.split("\n")[0].trim().replace(/\*\*/g, "")
    : `Solve the problem: ${title}`;

  // 1. FRONTEND ARCHITECTURE DOMAIN
  if (domain.includes("frontend")) {
    switch (lang) {
      case "typescript":
        return `import React, { useState, useEffect, useCallback, useMemo } from 'react';

/**
 * ${title} (${difficulty})
 * Prompt: ${promptSummary}
 */

export interface ${className}Props {
  initialValue?: string;
  onSubmit?: (data: any) => void;
  className?: string;
}

export const ${className}: React.FC<${className}Props> = ({
  initialValue = '',
  onSubmit,
  className = '',
}) => {
  const [value, setValue] = useState<string>(initialValue);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(value);
    }
  }, [value, onSubmit]);

  return (
    <div className={\`p-4 rounded-lg border border-slate-700 bg-slate-900 \${className}\`}>
      <h2 className="text-lg font-semibold text-white">${title}</h2>
      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter input..."
          className="w-full px-3 py-2 bg-slate-800 text-white rounded border border-slate-600 focus:outline-none focus:border-cyan-500"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-medium disabled:opacity-50"
        >
          {isLoading ? 'Processing...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default ${className};
`;

      case "javascript":
        return `import React, { useState, useCallback } from 'react';

/**
 * ${title} (${difficulty})
 * @param {{ initialValue?: string, onSubmit?: Function, className?: string }} props
 */
export function ${className}({ initialValue = '', onSubmit, className = '' }) {
  const [value, setValue] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(value);
    }
  }, [value, onSubmit]);

  return (
    <div className={\`p-4 rounded-lg border border-slate-700 bg-slate-900 \${className}\`}>
      <h2 className="text-lg font-semibold text-white">${title}</h2>
      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter input..."
          className="w-full px-3 py-2 bg-slate-800 text-white rounded border border-slate-600"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-medium"
        >
          {isLoading ? 'Processing...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}

export default ${className};
`;

      case "nodejs":
        return `/**
 * ${title} - SSR / Node.js Component Server Renderer
 * Prompt: ${promptSummary}
 */

const http = require('http');

class ${className}Server {
  constructor(port = 3000) {
    this.port = port;
  }

  renderHtml(state = {}) {
    return \`<!DOCTYPE html>
<html>
<head><title>${title}</title></head>
<body>
  <div id="root">
    <h1>${title}</h1>
    <p>State: \${JSON.stringify(state)}</p>
  </div>
</body>
</html>\`;
  }

  handleRequest(req, res) {
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ status: 'ok', service: '${className}' }));
    }

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(this.renderHtml());
  }

  listen() {
    const server = http.createServer((req, res) => this.handleRequest(req, res));
    return server.listen(this.port, () => {
      console.log(\`${className} listening on port \${this.port}\`);
    });
  }
}

module.exports = { ${className}Server };
`;

      default:
        // Fall back to standard language generation below
        break;
    }
  }

  // 2. LOW-LEVEL DESIGN / MACHINE CODING DOMAIN
  if (domain.includes("low-level") || domain.includes("lld")) {
    switch (lang) {
      case "typescript":
        return `/**
 * ${title} - Low-Level Design & Machine Coding
 * Difficulty: ${difficulty}
 * Prompt: ${promptSummary}
 */

export interface I${className}Service {
  execute(commandId: string, payload: Record<string, any>): Promise<boolean>;
  getState(): Record<string, any>;
}

export class ${className} implements I${className}Service {
  private state: Map<string, any>;

  constructor() {
    this.state = new Map();
  }

  public async execute(commandId: string, payload: Record<string, any>): Promise<boolean> {
    // TODO: Implement business logic and state transitions
    this.state.set(commandId, payload);
    return true;
  }

  public getState(): Record<string, any> {
    return Object.fromEntries(this.state);
  }
}

// Verification runner
export function runDemo(): void {
  const service = new ${className}();
  console.log("Initialized ${className}");
}
`;

      case "javascript":
        return `/**
 * ${title} - Low-Level Design & Machine Coding
 * Difficulty: ${difficulty}
 * Prompt: ${promptSummary}
 */

class ${className} {
  constructor() {
    this.state = new Map();
  }

  /**
   * @param {string} commandId
   * @param {Object} payload
   * @returns {Promise<boolean>}
   */
  async execute(commandId, payload) {
    // TODO: Implement state machine / business logic
    this.state.set(commandId, payload);
    return true;
  }

  getState() {
    return Object.fromEntries(this.state);
  }
}

// Verification runner
function runDemo() {
  const service = new ${className}();
  console.log("Initialized ${className}");
}

module.exports = { ${className}, runDemo };
`;

      case "nodejs":
        return `/**
 * ${title} - Node.js Backend Service Scaffolding
 * Difficulty: ${difficulty}
 * Prompt: ${promptSummary}
 */

const EventEmitter = require('events');

class ${className}Service extends EventEmitter {
  constructor() {
    super();
    this.store = new Map();
  }

  /**
   * Dispatches and processes an action asynchronously.
   * @param {string} actionType
   * @param {Record<string, any>} payload
   */
  async dispatch(actionType, payload = {}) {
    const transactionId = \`tx_\${Date.now()}_\${Math.random().toString(36).substring(2, 7)}\`;
    
    // Emit lifecycle event
    this.emit('action:start', { transactionId, actionType });

    try {
      // TODO: Implement core execution and concurrency invariants
      this.store.set(transactionId, { actionType, payload, createdAt: new Date() });
      this.emit('action:success', { transactionId, actionType });
      return { success: true, transactionId };
    } catch (err) {
      this.emit('action:error', { transactionId, error: err.message });
      throw err;
    }
  }

  getSnapshot() {
    return Array.from(this.store.entries()).map(([k, v]) => ({ id: k, ...v }));
  }
}

module.exports = { ${className}Service };
`;

      case "python":
        return `from typing import Dict, Any, Optional
from abc import ABC, abstractmethod

"""
${title} - Low-Level Design
Difficulty: ${difficulty}
Prompt: ${promptSummary}
"""

class I${className}(ABC):
    @abstractmethod
    def execute(self, command_id: str, payload: Dict[str, Any]) -> bool:
        pass


class ${className}(I${className}):
    def __init__(self) -> None:
        self._store: Dict[str, Any] = {}

    def execute(self, command_id: str, payload: Dict[str, Any]) -> bool:
        # TODO: Implement business logic and concurrency controls
        self._store[command_id] = payload
        return True

    def get_state(self) -> Dict[str, Any]:
        return self._store.copy()


if __name__ == "__main__":
    service = ${className}()
    print("Initialized ${className}")
`;

      case "java":
        return `import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * ${title} - Low-Level Design
 * Difficulty: ${difficulty}
 * Prompt: ${promptSummary}
 */
public class ${className} {
    private final Map<String, Object> store;

    public ${className}() {
        this.store = new ConcurrentHashMap<>();
    }

    public synchronized boolean execute(String commandId, Map<String, Object> payload) {
        // TODO: Implement business constraints and validation
        store.put(commandId, payload);
        return true;
    }

    public Map<String, Object> getState() {
        return Collections.unmodifiableMap(this.store);
    }

    public static void main(String[] args) {
        ${className} service = new ${className}();
        System.out.println("Initialized ${className}");
    }
}
`;

      case "cpp":
        return `#include <iostream>
#include <string>
#include <unordered_map>
#include <memory>
#include <mutex>

/**
 * ${title} - Low-Level Design
 * Difficulty: ${difficulty}
 * Prompt: ${promptSummary}
 */
class ${className} {
private:
    std::unordered_map<std::string, std::string> store;
    std::mutex mtx;

public:
    ${className}() = default;

    bool execute(const std::string& commandId, const std::string& payload) {
        std::lock_guard<std::mutex> lock(mtx);
        // TODO: Implement domain invariants
        store[commandId] = payload;
        return true;
    }

    bool hasCommand(const std::string& commandId) const {
        return store.find(commandId) != store.end();
    }
};

int main() {
    ${className} service;
    std::cout << "Initialized ${className}" << std::endl;
    return 0;
}
`;

      case "go":
        return `package main

import (
	"fmt"
	"sync"
)

// ${title} - Low-Level Design
// Difficulty: ${difficulty}
// Prompt: ${promptSummary}

type ${className} struct {
	mu    sync.RWMutex
	store map[string]interface{}
}

func New${className}() *${className} {
	return &${className}{
		store: make(map[string]interface{}),
	}
}

func (s *${className}) Execute(commandID string, payload interface{}) bool {
	s.mu.Lock()
	defer s.mu.Unlock()

	// TODO: Implement business logic and state machine
	s.store[commandID] = payload
	return true
}

func (s *${className}) GetState(commandID string) (interface{}, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	val, ok := s.store[commandID]
	return val, ok
}

func main() {
	service := New${className}()
	fmt.Println("Initialized ${className}:", service)
}
`;
    }
  }

  // 3. DATA STRUCTURES & ALGORITHMS (DSA) AND GENERAL CODING
  switch (lang) {
    case "typescript":
      return `/**
 * ${title} (${difficulty})
 * Prompt: ${promptSummary}
 *
 * Time Complexity Expected:  O(?)
 * Space Complexity Expected: O(?)
 */

export class Solution {
  /**
   * @param nums - Input integer sequence
   * @param target - Target integer value
   * @returns Computed result
   */
  public ${fnName}(nums: number[], target?: number): number {
    // TODO: Write your optimal solution here
    let result = 0;

    return result;
  }
}

// Example local test runner:
const solution = new Solution();
console.log("Result:", solution.${fnName}([2, 7, 11, 15], 9));
`;

    case "javascript":
      return `/**
 * ${title} (${difficulty})
 * Prompt: ${promptSummary}
 *
 * Time Complexity Expected:  O(?)
 * Space Complexity Expected: O(?)
 */

/**
 * @param {number[]} nums
 * @param {number} [target]
 * @return {number}
 */
function ${fnName}(nums, target) {
  // TODO: Write your optimal solution here
  let result = 0;

  return result;
}

// Example test run:
console.log("Result:", ${fnName}([2, 7, 11, 15], 9));

module.exports = { ${fnName} };
`;

    case "nodejs":
      return `/**
 * ${title} (${difficulty}) - Node.js High-Throughput Stream / Algorithmic Handler
 * Prompt: ${promptSummary}
 */

const { performance } = require('perf_hooks');

class Solution {
  /**
   * Computes the result with execution metrics.
   * @param {number[]} nums
   * @param {number} [target]
   * @returns {{ result: any, durationMs: number }}
   */
  static solve(nums, target) {
    const start = performance.now();

    // TODO: Write optimal solution logic
    let result = 0;
    for (let i = 0; i < nums.length; i++) {
      result += nums[i];
    }

    const durationMs = performance.now() - start;
    return { result, durationMs };
  }
}

// Verify execution
const { result, durationMs } = Solution.solve([2, 7, 11, 15], 9);
console.log(\`Result: \${result} (computed in \${durationMs.toFixed(3)}ms)\`);

module.exports = { Solution };
`;

    case "python":
      return `from typing import List, Optional, Dict

class Solution:
    """
    ${title} (${difficulty})
    Prompt: ${promptSummary}

    Time Complexity:  O(?)
    Space Complexity: O(?)
    """
    def ${fnName}(self, nums: List[int], target: Optional[int] = None) -> int:
        # TODO: Implement optimal algorithm
        result = 0
        return result


# Test execution:
if __name__ == "__main__":
    sol = Solution()
    print("Result:", sol.${fnName}([2, 7, 11, 15], 9))
`;

    case "java":
      return `import java.util.*;

/**
 * ${title} (${difficulty})
 * Prompt: ${promptSummary}
 *
 * Time Complexity:  O(?)
 * Space Complexity: O(?)
 */
public class Solution {
    public int ${fnName}(int[] nums, int target) {
        // TODO: Implement optimal solution
        int result = 0;
        return result;
    }

    public static void main(String[] args) {
        Solution sol = new Solution();
        int[] sample = {2, 7, 11, 15};
        System.out.println("Result: " + sol.${fnName}(sample, 9));
    }
}
`;

    case "cpp":
      return `#include <iostream>
#include <vector>
#include <unordered_map>
#include <algorithm>

/**
 * ${title} (${difficulty})
 * Prompt: ${promptSummary}
 *
 * Time Complexity:  O(?)
 * Space Complexity: O(?)
 */
class Solution {
public:
    int ${fnName}(const std::vector<int>& nums, int target = 0) {
        // TODO: Implement optimal algorithm
        int result = 0;
        return result;
    }
};

int main() {
    Solution sol;
    std::vector<int> sample = {2, 7, 11, 15};
    std::cout << "Result: " << sol.${fnName}(sample, 9) << std::endl;
    return 0;
}
`;

    case "go":
      return `package main

import (
	"fmt"
)

// ${title} (${difficulty})
// Prompt: ${promptSummary}
//
// Time Complexity:  O(?)
// Space Complexity: O(?)
func ${toPascalCase(fnName)}(nums []int, target int) int {
	// TODO: Implement optimal solution
	result := 0
	return result
}

func main() {
	sample := []int{2, 7, 11, 15}
	result := ${toPascalCase(fnName)}(sample, 9)
	fmt.Println("Result:", result)
}
`;
  }
}

// ============================================================
// Multi-Language Session Buffer Manager
// ============================================================

const IN_MEMORY_BUFFER_STORE = new Map<string, string>();

function getStorageKey(topicSlug: string, questionId: string, lang: SupportedLanguage): string {
  const cleanTopic = topicSlug || "default";
  const cleanQ = questionId || "q1";
  return `pim_code_${cleanTopic}_${cleanQ}_${lang}`;
}

/**
 * Retrieves the candidate's active code buffer for the given question and language.
 * Checks sessionStorage first, falls back to localStorage, then memory cache, then starter code template.
 */
export function getSavedCodeForLanguage(
  lang: SupportedLanguage,
  ctx: TemplateGenerationContext
): string {
  const topicSlug = ctx.topicSlug || "default";
  const questionId = ctx.questionId || "q1";
  const key = getStorageKey(topicSlug, questionId, lang);

  // 1. Try browser sessionStorage (current active session)
  if (typeof window !== "undefined" && window.sessionStorage) {
    try {
      const savedSession = window.sessionStorage.getItem(key);
      if (savedSession && savedSession.trim().length > 0) {
        return savedSession;
      }
    } catch {
      // sessionStorage restricted / unavailable
    }
  }

  // 2. Try browser localStorage
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      const savedLocal = window.localStorage.getItem(key);
      if (savedLocal && savedLocal.trim().length > 0) {
        return savedLocal;
      }
    } catch {
      // localStorage restricted / unavailable
    }
  }

  // 3. Try In-Memory Buffer
  if (IN_MEMORY_BUFFER_STORE.has(key)) {
    return IN_MEMORY_BUFFER_STORE.get(key)!;
  }

  // 4. Default to generated calibrated starter skeleton
  return generateStarterCode(lang, ctx);
}

/**
 * Saves candidate code to the isolated per-language buffer.
 */
export function saveCodeForLanguage(
  lang: SupportedLanguage,
  code: string,
  ctx: TemplateGenerationContext
): void {
  const topicSlug = ctx.topicSlug || "default";
  const questionId = ctx.questionId || "q1";
  const key = getStorageKey(topicSlug, questionId, lang);

  // Update in-memory store
  IN_MEMORY_BUFFER_STORE.set(key, code);

  // Update browser storage
  if (typeof window !== "undefined") {
    try {
      if (window.sessionStorage) {
        window.sessionStorage.setItem(key, code);
      }
      if (window.localStorage) {
        window.localStorage.setItem(key, code);
      }
    } catch {
      // Storage quota or restriction
    }
  }
}
