import React from 'react';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-[800px] max-w-[95%] flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">使用示例 (Examples)</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <div className="space-y-8">
            {/* YAML Section */}
            <section>
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">1</span>
                YAML 转 JSON 示例
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                  <div className="flex items-center gap-2 mb-2 text-green-700 font-medium text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    正确写法 (Correct)
                  </div>
                  <pre className="text-xs text-green-800 font-mono whitespace-pre bg-white/50 p-2 rounded overflow-x-auto">
{`user:
  name: Alice     # 冒号后有空格
  roles:
    - admin       # 缩进正确(2空格)
    - editor      # 列表项横杠后有空格`}
                  </pre>
                </div>

                <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                  <div className="flex items-center gap-2 mb-2 text-red-700 font-medium text-sm">
                    <AlertCircle className="w-4 h-4" />
                    错误写法 (Wrong)
                  </div>
                  <pre className="text-xs text-red-800 font-mono whitespace-pre bg-white/50 p-2 rounded overflow-x-auto">
{`user:
  name:Alice      # 错误：冒号后缺空格
  roles:
    - admin
  - editor        # 错误：缩进不一致
    -guest        # 错误：横杠后缺空格`}
                  </pre>
                </div>
              </div>
            </section>

            {/* Markdown Section */}
            <section>
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">2</span>
                Markdown 转 JSON 示例
              </h3>
              <p className="text-xs text-gray-500 mb-3 ml-8">
                支持使用 Markdown 语法编写配置：使用 <code>#</code> 表示层级/键名，使用 <code>*</code> 或 <code>+</code> 表示列表。
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                  <div className="flex items-center gap-2 mb-2 text-green-700 font-medium text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    正确写法 (Correct)
                  </div>
                  <pre className="text-xs text-green-800 font-mono whitespace-pre bg-white/50 p-2 rounded overflow-x-auto">
{`# user
**name**: Alice   # 支持加粗键名
**roles**:
* admin           # 星号列表
* editor          # 星号后有空格`}
                  </pre>
                </div>

                <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                  <div className="flex items-center gap-2 mb-2 text-red-700 font-medium text-sm">
                    <AlertCircle className="w-4 h-4" />
                    错误写法 (Wrong)
                  </div>
                  <pre className="text-xs text-red-800 font-mono whitespace-pre bg-white/50 p-2 rounded overflow-x-auto">
{`#user             # 错误：#后缺空格
**name**:Alice    # 错误：冒号后缺空格
**roles**:
*admin            # 错误：星号后缺空格
  * editor        # 缩进需保持一致`}
                  </pre>
                </div>
              </div>
            </section>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            知道了
          </button>
        </div>
      </div>
    </div>
  );
};
