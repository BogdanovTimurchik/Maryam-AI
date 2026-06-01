/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send, Activity, HelpCircle, User, Bot, RefreshCw, AlertCircle } from 'lucide-react';
import { ChatMessage, Language } from '../types';

interface AIAssistantChatProps {
  language: Language;
}

export default function AIAssistantChat({ language }: AIAssistantChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial",
      role: "assistant",
      content: language === 'uz' 
        ? "Assalomu alaykum! Men Maryam AI tibbiy radiologik ИИ-assistentiman. Menga istalgan tasvir tahlili, KT/MRT terminlari, MKB-10 tasniflari yoki O'zbekistondagi klinika tajribalariga doir savollar berishingiz mumkin."
        : language === 'en'
        ? "Hello! I am Maryam AI, your medical radiological co-pilot. You can consult with me regarding differential diagnostics, scan protocols, BI-RADS classification, or general ICD-10 codings."
        : "Здравствуйте! Я ИИ-консультант Maryam AI по лучевой диагностике. Здесь вы можете оперативно уточнить протоколы исследований, дифференциальные диагнозы, шкалы BI-RADS/PI-RADS или получить помощь по классификации МКБ-10.",
      timestamp: new Date().toLocaleTimeString()
    }
  ]);

  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle Preset Q&A Clicks
  const handlePresetQuery = (topic: string) => {
    let query = "";
    if (topic === 'pneumonia') {
      query = language === 'uz'
        ? "O'pka rentgenda segmentar pnevmoniya infiltratsiyalari qanday aniqlanadi va uning MKB-10 kodi nima?"
        : language === 'en'
        ? "What are the key chest X-Ray signs for segmental pneumonia and its corresponding ICD-10 codes?"
        : "Какие основные рентгенологические признаки сегментарной пневмонии легкого и какие коды МКБ-10 соответствуют?";
    } else if (topic === 'ich_edema') {
      query = language === 'uz'
        ? "Bosh miya tomografiyasida o'tkir miya ichi qon quyilishining (gematoma) perifokal shishi va uning jarrohlik chegaralari haqida ma'lumot bering."
        : language === 'en'
        ? "Explain vasogenic perifocal edema around the intracerebral hematoma and normal surgical thresholds."
        : "Опишите вазогенный перифокальный отек вокруг внутримозговой гематомы и показания к экстренной эвакуации.";
    } else {
      query = language === 'uz'
        ? "Umarqa umurtqalarida L4-L5 darajasidagi disk grijlari uchun fizioterapiya va operatsiya ko'rsatgichlari qanday?"
        : language === 'en'
        ? "What are conservative rehabilitation vs neurosurgical surgery indications for L4-L5 lumbar disc herniation?"
        : "Каковы показания к консервативной реабилитации в противовес хирургии при грыжах межпозвоночного диска L4-L5?";
    }
    
    setInputText(query);
    sendMessage(query);
  };

  const formSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(inputText.trim());
  };

  const sendMessage = async (textToSend: string) => {
    setInputText("");
    setErrorStatus(null);
    setLoading(true);

    const newUserMessage: ChatMessage = {
      id: Math.random().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newUserMessage]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [...messages, newUserMessage],
          language: language
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Tizim aloqa kanallari band.");
      }

      const newAiMessage: ChatMessage = {
        id: Math.random().toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, newAiMessage]);

    } catch (err: any) {
      console.error(err);
      setErrorStatus(
        language === 'uz'
          ? "Ulanish xatosi. Maryam AI statsionari vaqtincha offline rejimda ishlamoqda."
          : "Сбой соединения с сервером. Включена автономная локальная фильтрация консультаций."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden flex flex-col h-[560px] sm:h-[620px]">
      
      {/* Header component */}
      <div className="bg-slate-50 border-b border-slate-200 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600">
            <Bot size={18} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm leading-snug">
              {language === 'uz' ? 'Maryam AI Maslahat Tizimi' : language === 'en' ? 'Clinical Decision Support Center' : 'Консультации Maryam AI'}
            </h3>
            <p className="text-[10px] text-slate-500 font-mono font-medium">
              ROLE: RESIDENT RESEARCH CO-PILOT
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="inline-block h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
          <span className="text-[10px] font-mono text-indigo-600 font-bold uppercase tracking-widest hidden sm:inline">ONLINE</span>
        </div>
      </div>

      {/* Chat messages viewport */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin bg-slate-50/20">
        {messages.map((msg) => (
          <div
            id={`message-container-${msg.id}`}
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-2.5 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              
               {/* Avatar Icon */}
              <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 border text-xs ${
                msg.role === 'user' 
                  ? 'bg-slate-100 border-slate-200 text-slate-700 font-bold' 
                  : 'bg-indigo-50 border border-indigo-100 text-indigo-650'
              }`}>
                {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
              </div>

              {/* Message text bubble */}
              <div className="flex flex-col">
                <div className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-tr-none shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none whitespace-pre-wrap shadow-xs'
                }`}>
                  {msg.content}
                </div>
                <span className={`text-[9px] font-mono mt-1 text-slate-400 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp}
                </span>
              </div>

            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2.5 max-w-[80%]">
              <div className="h-8 w-8 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-650 flex items-center justify-center shrink-0">
                <RefreshCw size={14} className="animate-spin" />
              </div>
              <div className="bg-white border border-slate-150 text-xs sm:text-sm text-slate-500 p-3.5 rounded-2xl rounded-tl-none font-mono shadow-xs">
                {language === 'uz' ? 'Tahlillarni qayta koʻrib chiqmoqdaman...' : 'Формулирую заключение...'}
              </div>
            </div>
          </div>
        )}

        {errorStatus && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center space-x-2">
            <AlertCircle className="text-amber-600 shrink-0" size={14} />
            <p className="text-[11px] text-amber-800 font-mono">{errorStatus}</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested clinical quick templates */}
      <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex flex-wrap gap-2">
        <span className="text-[10px] text-slate-400 font-mono font-bold uppercase flex items-center self-center shrink-0">
          <HelpCircle size={10} className="mr-1" /> FAQ:
        </span>
        <button
          id="btn-faq-pneumonia"
          onClick={() => handlePresetQuery('pneumonia')}
          className="text-[10px] bg-white hover:bg-slate-50 font-sans px-2.5 py-1.5 rounded-lg border border-slate-250 text-slate-700 transition cursor-pointer shadow-xs"
        >
          {language === 'uz' ? "Pnevmoniya rentgen belgilari" : "Критерии Рентген Пневмонии"}
        </button>
        <button
          id="btn-faq-edema"
          onClick={() => handlePresetQuery('ich_edema')}
          className="text-[10px] bg-white hover:bg-slate-50 font-sans px-2.5 py-1.5 rounded-lg border border-slate-250 text-slate-700 transition cursor-pointer shadow-xs"
        >
          {language === 'uz' ? "Miya qon quyilishi shishi" : "КТ Гематомы и Набухание"}
        </button>
        <button
          id="btn-faq-spine"
          onClick={() => handlePresetQuery('spine_hernia')}
          className="text-[10px] bg-white hover:bg-slate-50 font-sans px-2.5 py-1.5 rounded-lg border border-slate-250 text-slate-700 transition cursor-pointer shadow-xs"
        >
          {language === 'uz' ? "L4-L5 disk griji ko'rsatmalari" : "Показания по грыже L4-L5"}
        </button>
      </div>

      {/* Input writing Form */}
      <form onSubmit={formSubmit} className="bg-white border-t border-slate-200 p-3.5 flex items-center space-x-2">
        <input
          id="chat-user-input"
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={
            language === 'uz'
              ? 'MKB-10 kodlari yoki MRT tahlillarini yozing...'
              : language === 'en'
              ? 'Ask for BI-RADS guidelines, CT slice properties...'
              : 'Запрос по патологии, МКБ-10 кодам, BI-RADS...'
          }
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-505/30"
        />
        <button
          id="btn-send-chat"
          type="submit"
          className="h-11 w-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center cursor-pointer shadow-sm transition shrink-0"
        >
          <Send size={16} />
        </button>
      </form>

    </div>
  );
}
